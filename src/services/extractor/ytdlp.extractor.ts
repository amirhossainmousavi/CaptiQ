import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { extractVideoId } from '../../utils/video';

const execAsync = promisify(exec);

export interface SubtitleItem {
  start: string;
  end: string;
  text: string;
}

export class YtDlpExtractor {
  private static readonly YT_DLP_PATH = process.env.YT_DLP_PATH || 'yt-dlp';
  private static readonly TIMEOUT = parseInt(process.env.YT_DLP_TIMEOUT_MS || '30000', 10);

  private static buildCommand(subCommand: string, videoId: string, useProxy: boolean, useCookie: boolean): string {
    let flags = '--no-cache-dir --no-update';
    if (useProxy && process.env.YT_DLP_PROXY) {
      flags += ` --proxy "${process.env.YT_DLP_PROXY}"`;
    }
    if (useCookie && process.env.YT_DLP_COOKIES_FILE) {
      flags += ` --cookies "${process.env.YT_DLP_COOKIES_FILE}"`;
    }
    return `${this.YT_DLP_PATH} ${flags} ${subCommand} ${videoId}`;
  }

  private static async executeWithFallback(subCommand: string, videoId: string): Promise<string> {
    const hasProxy = !!process.env.YT_DLP_PROXY;
    const hasCookie = !!process.env.YT_DLP_COOKIES_FILE;

    let lastError: any;

    if (hasProxy) {
      try {
        const cmd = this.buildCommand(subCommand, videoId, true, false);
        const { stdout } = await execAsync(cmd, { timeout: this.TIMEOUT });
        return stdout;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (hasCookie) {
      try {
        const cmd = this.buildCommand(subCommand, videoId, false, true);
        const { stdout } = await execAsync(cmd, { timeout: this.TIMEOUT });
        return stdout;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!hasProxy && !hasCookie) {
      try {
        const cmd = this.buildCommand(subCommand, videoId, false, false);
        const { stdout } = await execAsync(cmd, { timeout: this.TIMEOUT });
        return stdout;
      } catch (err: any) {
        lastError = err;
      }
    }

    const err = new Error('Extraction failed. Please configure YT_DLP_PROXY or YT_DLP_COOKIES_FILE in .env environment variables.');
    (err as any).statusCode = 429;
    throw err;
  }

  static async getTranscript(videoUrl: string, lang = 'en'): Promise<SubtitleItem[]> {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      const err = new Error('Invalid YouTube URL');
      (err as any).statusCode = 400;
      throw err;
    }

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'captiq-'));
    const outputTemplate = path.join(tmpDir, '%(id)s');

    try {
      const stdout = await this.executeWithFallback(`--list-subs`, videoId);

      if (stdout.includes('Sign in to confirm') || stdout.includes('429')) {
        const err = new Error('YouTube rate-limited or blocked. Configure YT_DLP_PROXY or YT_DLP_COOKIES_FILE.');
        (err as any).statusCode = 429;
        throw err;
      }

      if (stdout.includes('has no subtitles')) {
        const err = new Error('English subtitles not available');
        (err as any).statusCode = 404;
        throw err;
      }

      const availableSubs = this.parseAvailableSubs(stdout);
      const selectedTrack = this.selectBestTrack(availableSubs);
      if (!selectedTrack) {
        const err = new Error('English subtitles not available');
        (err as any).statusCode = 404;
        throw err;
      }

      const downloadStdout = await this.executeWithFallback(`--write-subs --sub-langs "${selectedTrack}" --skip-download --convert-subs vtt -o "${outputTemplate}"`, videoId);

      const files = fs.readdirSync(tmpDir);
      const vttFile = files.find(f => f.endsWith('.vtt'));

      if (!vttFile) {
        const err = new Error('Failed to download selected subtitle track');
        (err as any).statusCode = 404;
        throw err;
      }

      return this.parseVtt(path.join(tmpDir, vttFile));
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw new Error(`Extraction failed: ${error.message}`);
    } finally {
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch (e) {
      }
    }
  }

  private static parseAvailableSubs(stdout: string): string[] {
    const lines = stdout.split('\n');
    const subs: string[] = [];
    let isManualSection = false;
    for (const line of lines) {
      if (line.includes('Available subtitles for')) isManualSection = true;
      else if (line.includes('Available automatic captions for')) isManualSection = false;

      if (isManualSection) {
        const match = line.match(/^([a-z0-9_-]+)\s+/);
        if (match) subs.push(match[1]);
      }
    }
    return subs;
  }

  private static selectBestTrack(availableSubs: string[]): string | null {
    const priority = ['en', 'en-US', 'en-GB', 'en-CA', 'en-AU'];
    for (const p of priority) if (availableSubs.includes(p)) return p;
    return availableSubs.find(s => s.startsWith('en')) || null;
  }

  private static parseVtt(filePath: string): SubtitleItem[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sections = content.split('\n\n');
    const items: SubtitleItem[] = [];
    for (const section of sections) {
      const lines = section.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) continue;
      const timeMatch = lines[0].match(/(\d{2}:\d{2}:\d{2}.\d{3}) --> (\d{2}:\d{2}:\d{2}.\d{3})/);
      if (timeMatch) {
        const text = lines.slice(1).join(' ').replace(/<[^>]*>/g, '').trim();
        if (text) items.push({ start: timeMatch[1], end: timeMatch[2], text });
      }
    }
    return items;
  }
}
