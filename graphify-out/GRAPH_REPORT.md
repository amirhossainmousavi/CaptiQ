# Graph Report - .  (2026-08-04)

## Corpus Check
- Corpus is ~4,657 words - fits in a single context window. You may not need a graph.

## Summary
- 109 nodes · 155 edges · 8 communities (7 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Subtitle Pipeline Core
- TypeScript Build Config
- Runtime Dependencies
- Dev Dependencies
- Package Metadata
- HTTP Server & Cache
- yt-dlp Extractor
- YouTube Service & Video Utils

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 11 edges
2. `SubtitleItem` - 9 edges
3. `handleSubtitles()` - 8 edges
4. `CacheService` - 8 edges
5. `YtDlpExtractor` - 8 edges
6. `LLMProvider` - 8 edges
7. `extractVideoId()` - 7 edges
8. `scripts` - 5 edges
9. `GeminiProvider` - 5 edges
10. `OpenAIProvider` - 5 edges

## Surprising Connections (you probably didn't know these)
- `handleSubtitles()` --calls--> `extractVideoId()`  [EXTRACTED]
  src/controllers/subtitles.controller.ts → src/utils/video.ts
- `GeminiProvider` --implements--> `LLMProvider`  [EXTRACTED]
  src/services/translator/gemini.provider.ts → src/services/translator/llm.provider.ts
- `OpenAIProvider` --implements--> `LLMProvider`  [EXTRACTED]
  src/services/translator/openai.provider.ts → src/services/translator/llm.provider.ts
- `OpenRouterProvider` --implements--> `LLMProvider`  [EXTRACTED]
  src/services/translator/openrouter.provider.ts → src/services/translator/llm.provider.ts

## Import Cycles
- None detected.

## Communities (8 total, 1 thin omitted)

### Community 0 - "Subtitle Pipeline Core"
Cohesion: 0.22
Nodes (6): requestSchema, SubtitleItem, GeminiProvider, LLMProvider, OpenAIProvider, OpenRouterProvider

### Community 1 - "TypeScript Build Config"
Cohesion: 0.11
Nodes (18): ES2020, node, node_modules, **/*.spec.ts, src/**/*, compilerOptions, esModuleInterop, forceConsistentCasingInFileNames (+10 more)

### Community 2 - "Runtime Dependencies"
Cohesion: 0.13
Nodes (15): cors, dotenv, express, @google/generative-ai, openai, dependencies, cors, dotenv (+7 more)

### Community 3 - "Dev Dependencies"
Cohesion: 0.13
Nodes (15): nodemon, devDependencies, nodemon, ts-node, ts-node-dev, @types/cors, @types/express, @types/node (+7 more)

### Community 4 - "Package Metadata"
Cohesion: 0.15
Nodes (12): author, description, keywords, license, main, name, scripts, build (+4 more)

### Community 5 - "HTTP Server & Cache"
Cohesion: 0.26
Nodes (4): handleSubtitles(), router, app, CacheService

### Community 7 - "YouTube Service & Video Utils"
Cohesion: 0.48
Nodes (3): execAsync, YoutubeService, extractVideoId()

## Knowledge Gaps
- **40 isolated node(s):** `name`, `version`, `description`, `main`, `start` (+35 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Runtime Dependencies` to `Package Metadata`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies` to `Package Metadata`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `extractVideoId()` connect `YouTube Service & Video Utils` to `Subtitle Pipeline Core`, `HTTP Server & Cache`, `yt-dlp Extractor`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _40 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Build Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Dev Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._