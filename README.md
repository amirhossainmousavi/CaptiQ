# 🚀 CaptiQ

> **AI-powered YouTube subtitle extraction, translation, and summarization service built with Node.js & TypeScript.**

CaptiQ is a modular and high-performance backend service that extracts YouTube subtitles, processes them with AI models, and provides intelligent translation or summarization capabilities through a clean REST API.

Designed with scalability, performance, and maintainability in mind, CaptiQ supports multiple AI providers and uses an extensible provider-based architecture.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎬 **Smart Subtitle Extraction** | Extracts YouTube subtitles using `yt-dlp` with an intelligent priority-based selection algorithm |
| 🧠 **AI Processing** | Translate subtitles or generate summaries using modern LLM providers |
| 🌍 **Multi Provider Support** | Supports OpenAI, Google Gemini, and OpenRouter |
| ⚡ **High Performance** | Built-in caching and concurrency control to reduce unnecessary processing |
| 🏗️ **Modular Architecture** | Provider-based design makes adding new AI models simple |
| 🔒 **Request Optimization** | Prevents duplicate processing for the same YouTube video |
| 📦 **Type Safe** | Fully written in TypeScript |
| 🔌 **REST API** | Clean, predictable JSON-based API responses |

---

# 🏛️ Architecture Overview

CaptiQ follows a modular service-based architecture:

```
src
├── controllers        # API request handlers
├── routes             # API route definitions
├── services
│   ├── extractor      # YouTube subtitle extraction
│   ├── translator     # AI translation providers
│   ├── summarizer     # AI summarization services
│   └── cache          # Cache & locking mechanisms
├── providers          # AI provider implementations
└── utils              # Shared utilities
```

---

# 🔄 Processing Flow

```
YouTube URL
     |
     ▼
yt-dlp Subtitle Extractor
     |
     ▼
Subtitle Selection Engine
     |
     ▼
Cache Layer
     |
     ▼
AI Provider
(OpenAI / Gemini / OpenRouter)
     |
     ▼
Translated Subtitle
or
AI Summary
```

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| TypeScript | Type-safe development |
| Express.js | REST API framework |
| yt-dlp | YouTube subtitle extraction |
| OpenAI API | AI translation & summarization |
| Google Gemini | Alternative AI provider |
| OpenRouter | Multi-model AI access |
| File System Cache | Performance optimization |

---

# 📋 Requirements

Before running CaptiQ, make sure you have:

| Requirement | Version |
|---|---|
| Node.js | `20.x` or higher |
| npm | Latest version |
| yt-dlp | Installed and available in PATH |

---

# ⚡ Installation

## 1. Clone Repository

```bash
git clone https://github.com/your-username/CaptiQ.git

cd CaptiQ
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create your environment file:

```bash
cp .env.example .env
```

Update the values based on your AI provider.

## 4. Start Development Server

```bash
npm run dev
```

---

# ⚙️ Environment Configuration

`.env`

| Variable | Description | Example |
|---|---|---|
| `AI_PROVIDER` | Active AI provider | `openai` |
| `AI_API_KEY` | Provider API key | `your_api_key` |
| `AI_MODEL` | Selected AI model | `gpt-4o-mini` |
| `YT_DLP_PATH` | yt-dlp executable path | `/usr/local/bin/yt-dlp` |
| `CACHE_TTL_HOURS` | Cache expiration duration | `24` |

Supported providers:

```
openai
google
openrouter
```

---

# 📡 API Documentation

## Extract & Process YouTube Subtitles

### Endpoint

```
POST /api/subtitles
```

---

## Request

### Body

```json
{
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "lang": "en",
  "type": "translate"
}
```

### Parameters

| Field | Type | Required | Description |
|---|---|---|---|
| `videoUrl` | string | ✅ | YouTube video URL |
| `lang` | string | ❌ | Subtitle language |
| `type` | string | ❌ | `translate` or `summarize` |

Default:

```
type = translate
```

---

# ✅ Response Examples

## Translation Response

```json
{
  "success": true,
  "videoId": "VIDEO_ID",
  "subtitles": [
    {
      "start": "00:00:12.645",
      "end": "00:00:14.015",
      "text": "Translated subtitle text"
    }
  ]
}
```

---

## Summary Response

```json
{
  "success": true,
  "videoId": "VIDEO_ID",
  "summary": "AI generated summary of the video..."
}
```

---

# 🧠 AI Provider System

CaptiQ uses a provider-based architecture.

Adding a new AI provider only requires implementing the provider interface.

Currently supported:

| Provider | Supported |
|---|---|
| OpenAI | ✅ |
| Google Gemini | ✅ |
| OpenRouter | ✅ |
| Custom Providers | 🔜 |

---

# 🚀 Performance Features

## Cache System

CaptiQ stores processed results and reuses them until expiration.

Benefits:

- Faster responses
- Lower AI API costs
- Reduced processing time


## Concurrency Locking

The service prevents multiple simultaneous requests for the same video:

```
Request A ───┐
             ├──► Process Once
Request B ───┘
```

---

# 📁 Project Structure

```
src/
│
├── controllers/
│
├── routes/
│
├── services/
│   ├── extractor/
│   ├── translator/
│   ├── summarizer/
│   └── cache/
│
├── providers/
│
└── utils/

docs/
```

---

# 🧪 Development

Run development server:

```bash
npm run dev
```

Build project:

```bash
npm run build
```

Run production:

```bash
npm start
```

---

# 🗺️ Roadmap

- [x] YouTube subtitle extraction
- [x] AI translation
- [x] AI summarization
- [x] Multiple AI providers
- [x] Cache system
- [x] Concurrency protection

Future:

- [ ] Authentication system
- [ ] Database storage
- [ ] User dashboard
- [ ] Subtitle export formats
- [ ] Queue-based processing

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit changes

```bash
git commit -m "Add amazing feature"
```

4. Push branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub.

---

<p align="center">
Built with ❤️ using Node.js, TypeScript and AI
</p>
# CaptiQ
# CaptiQ
