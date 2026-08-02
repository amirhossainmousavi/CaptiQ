import OpenAI from 'openai';
import { LLMProvider } from './llm.provider';
import { SubtitleItem } from '../extractor/ytdlp.extractor';

export class OpenRouterProvider implements LLMProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'https://captiq.find-sub',
        'X-Title': 'CaptiQ Find-sub'
      }
    });
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
