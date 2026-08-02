import OpenAI from 'openai';
import { LLMProvider } from './llm.provider';
import { SubtitleItem } from '../extractor/ytdlp.extractor';

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async process(items: SubtitleItem[], model: string, systemPrompt: string): Promise<any> {
    const response = await this.client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(items) }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return parsed.subtitles || parsed.summary || parsed;
  }
}
