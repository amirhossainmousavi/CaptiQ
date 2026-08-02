import { exec } from 'child_process';
import { promisify } from 'util';
import { extractVideoId } from '../utils/video';

const execAsync = promisify(exec);

export class YoutubeService {
  private static readonly YT_DLP_PATH = process.env.YT_DLP_PATH || 'yt-dlp';
  private static readonly TIMEOUT = parseInt(process.env.YT_DLP_TIMEOUT_MS || '30000', 10);

  static async getSubtitles(videoUrl: string): Promise<any> {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    return await this.executeWithRetry(videoId);
  }

  private static async executeWithRetry(videoId: string, attempt = 1): Promise<any> {
    try {
      // List available subtitles
      const { stdout } = await execAsync(`${this.YT_DLP_PATH} --list-subs --skip-download --print-json ${videoId}`, {
        timeout: this.TIMEOUT
      });
      
      return JSON.parse(stdout);
    } catch (error: any) {
      if (attempt < 2) {
        const delay = attempt === 1 ? 1000 : 3000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeWithRetry(videoId, attempt + 1);
      }
      
      if (error.message.includes('429') || error.message.includes('rate-limited')) {
        throw new Error('YouTube rate-limited the request, try again later');
      }
      
      throw error;
    }
  }
}