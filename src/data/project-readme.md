---
title: "Project: Personal Codex Agent"
source: "Project README"
tags: ["ai", "nextjs", "pinecone", "openai", "vector-search"]
---

# Personal Codex Agent

## Overview
A sophisticated AI-powered document search and retrieval system that allows users to query their personal knowledge base using natural language. Built with modern web technologies and powered by OpenAI's embedding models and Pinecone vector database.

## Features
- **Document Ingestion**: Automatic processing of PDF, Markdown, and text files
- **Smart Chunking**: Intelligent text segmentation with configurable overlap
- **Vector Search**: Semantic search using OpenAI's text-embedding-3-large model
- **Metadata Enrichment**: Automatic extraction of titles, sources, and tags
- **Real-time Querying**: Fast retrieval with context-aware results
- **Citation Support**: Source attribution for all search results

## Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Document      │    │   Ingestion     │    │   Vector        │
│   Sources       │───▶│   Pipeline      │───▶│   Database      │
│   (PDF/MD/TXT)  │    │   (Chunking +   │    │   (Pinecone)    │
└─────────────────┘    │   Embeddings)   │    └─────────────────┘
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Search        │
                       │   Interface     │
                       │   (Next.js)     │
                       └─────────────────┘
```

## Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **AI/ML**: OpenAI Embeddings API, LangChain
- **Vector DB**: Pinecone (dimension: 3072, metric: cosine)
- **Document Processing**: pdf-parse, gray-matter, unified/remark
- **Text Chunking**: LangChain RecursiveCharacterTextSplitter

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/pnpm
- OpenAI API key
- Pinecone account and index

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `env.example` to `.env.local` and fill in your API keys
4. Create a Pinecone index with dimension 3072 and cosine metric

### Usage
1. Place your documents in the `/src/data` directory
2. Run the ingestion script: `npm run ingest`
3. Start the development server: `npm run dev`

## Document Format Support

### Markdown Files
Support for front-matter metadata:
```yaml
---
title: "Document Title"
source: "CV" | "Project README" | "Work-Style Notes" | "Doc"
tags: ["tag1", "tag2", "tag3"]
---
```

### PDF Files
Automatic text extraction with pdf-parse library.

### Text Files
Plain text with optional front-matter support.

## Configuration
- **Chunk Size**: 1200 characters (configurable)
- **Chunk Overlap**: 200 characters (configurable)
- **Batch Size**: 32 documents per embedding batch
- **Vector Dimension**: 3072 (OpenAI text-embedding-3-large)

## API Endpoints
- `POST /api/chat` - Main chat interface
- `GET /api/health` - Health check endpoint

## Development
- **Linting**: ESLint with Next.js configuration
- **Type Checking**: TypeScript strict mode
- **Formatting**: Prettier (recommended)

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License
MIT License - see LICENSE file for details
