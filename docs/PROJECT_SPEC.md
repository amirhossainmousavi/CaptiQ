# Project Specification (CaptiQ)

## Overview
A Node.js backend service to extract, translate, and summarize YouTube subtitles.

## API
- POST /api/subtitles: Extracts, translates or summarizes subtitles.
- Request Body: { videoUrl: string, lang?: string, type?: 'translate' | 'summarize' }
- Response: { success: true, videoId: string, subtitles?: SubtitleItem[], summary?: string }

## Features
- AI Integration (OpenAI, Gemini, OpenRouter)
- Filesystem Caching (with TTL)
- Concurrency Locking per video
- 8-step Subtitle Priority Algorithm
- Configuration via .env
