import { SubtitleItem } from '../extractor/ytdlp.extractor';

export interface LLMProvider {
  process(items: SubtitleItem[], model: string, systemPrompt: string): Promise<SubtitleItem[]>;
}
