import * as fs from 'fs';
import * as path from 'path';

export class CacheService {
  private static readonly CACHE_DIR = process.env.CACHE_DIR || './cache';
  private static locks = new Set<string>();

  constructor() {
    if (!fs.existsSync(CacheService.CACHE_DIR)) {
      fs.mkdirSync(CacheService.CACHE_DIR, { recursive: true });
    }
  }

  private static getFilePath(key: string): string {
    if (!fs.existsSync(this.CACHE_DIR)) {
      fs.mkdirSync(this.CACHE_DIR, { recursive: true });
    }
    return path.join(this.CACHE_DIR, `${key}.json`);
  }

  static async acquireLock(videoId: string): Promise<void> {
    while (this.locks.has(videoId)) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.locks.add(videoId);
  }

  static releaseLock(videoId: string): void {
    this.locks.delete(videoId);
  }

  static read(key: string): any {
    const filePath = this.getFilePath(key);
    if (!fs.existsSync(filePath)) return null;

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const ttlHours = parseInt(process.env.CACHE_TTL_HOURS || '168', 10);
    const now = Date.now();

    if (now - data.timestamp > ttlHours * 3600 * 1000) {
      fs.unlinkSync(filePath);
      return null;
    }

    return data.payload;
  }

  static write(key: string, payload: any): void {
    const filePath = this.getFilePath(key);
    const data = {
      timestamp: Date.now(),
      payload
    };
    fs.writeFileSync(filePath, JSON.stringify(data));
  }
}
