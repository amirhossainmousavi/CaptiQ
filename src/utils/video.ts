/**
 * Extracts the video ID from various YouTube URL formats.
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    
    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.slice(1);
    }
    
    if (parsedUrl.hostname.includes('youtube.com')) {
      if (parsedUrl.pathname === '/watch') {
        return parsedUrl.searchParams.get('v');
      }
      if (parsedUrl.pathname.startsWith('/embed/')) {
        return parsedUrl.pathname.split('/')[2];
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}