import { LLMProvider } from './llm.provider';
import { SubtitleItem } from '../extractor/ytdlp.extractor';

export class GeminiProvider implements LLMProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async process(items: SubtitleItem[], model: string, systemPrompt: string): Promise<any> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': this.apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\n${JSON.stringify(items)}` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data = await response.json() as any;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Invalid response structure');
    }

    const parsed = JSON.parse(text);
    return parsed.subtitles || parsed.summary || parsed;
  }
}
