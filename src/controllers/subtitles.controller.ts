import { Request, Response } from 'express';
import { z } from 'zod';
import { YtDlpExtractor } from '../services/extractor/ytdlp.extractor';
import { OpenAIProvider } from '../services/translator/openai.provider';
import { OpenRouterProvider } from '../services/translator/openrouter.provider';
import { GeminiProvider } from '../services/translator/gemini.provider';
import { CacheService } from '../services/cache/cache.service';
import { extractVideoId } from '../utils/video';

const TRANSLATE_PROMPT = `You are a professional subtitle translator.
Translate English subtitles into Persian.
Rules:
- Translate only the text field.
- Keep start unchanged.
- Keep end unchanged.
- Keep JSON structure unchanged.
- Do not merge subtitles.
- Do not split subtitles.
- Do not add explanations.
- Return JSON only with the following structure: {"subtitles": [{"start": "...", "end": "...", "text": "..."}]}`;

const SUMMARIZE_PROMPT = `You are a helpful assistant.
Summarize the following subtitles in Persian.
Return a concise summary of the video content.
Return JSON only with the following structure: {"summary": "..."}`;

const providerType = process.env.AI_PROVIDER;
let providerInstance: any;

switch (providerType) {
  case 'openai': providerInstance = new OpenAIProvider(process.env.AI_API_KEY!); break;
  case 'openrouter': providerInstance = new OpenRouterProvider(process.env.AI_API_KEY!); break;
  case 'google': providerInstance = new GeminiProvider(process.env.AI_API_KEY!); break;
}

const requestSchema = z.object({
  videoUrl: z.string().url(),
  lang: z.string().optional(),
  type: z.enum(['translate', 'summarize']).default('translate'),
});

export const handleSubtitles = async (req: Request, res: Response) => {
  const validation = requestSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues });
  }

  const { videoUrl, lang, type } = validation.data;
  const videoId = extractVideoId(videoUrl);

  if (!videoId) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  const cacheKey = `${videoId}-${lang || 'en'}-${providerType}-${process.env.AI_MODEL}-${type}`;

  const cached = CacheService.read(cacheKey);
  if (cached) return res.json(cached);

  try {
    await CacheService.acquireLock(videoId);

    const cachedAfterLock = CacheService.read(cacheKey);
    if (cachedAfterLock) {
      CacheService.releaseLock(videoId);
      return res.json(cachedAfterLock);
    }

    const transcriptItems = await YtDlpExtractor.getTranscript(videoUrl, lang || 'en');
    const prompt = type === 'translate' ? TRANSLATE_PROMPT : SUMMARIZE_PROMPT;

    const result = await providerInstance.process(transcriptItems, process.env.AI_MODEL!, prompt);

    let response;
    if (type === 'translate') {
      response = { success: true, videoId, subtitles: result };
    } else {
      response = { success: true, videoId, summary: result };
    }

    CacheService.write(cacheKey, response);
    res.json(response);
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Processing failed', details: error.message });
    }
  } finally {
    CacheService.releaseLock(videoId);
  }
};
