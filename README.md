# Matthew's Codex - Personal Knowledge Assistant

A personal knowledge assistant built with Next.js + Tailwind + shadcn/ui. The UI is complete and ready for backend functionality implementation.

## Features

- **Personal Chat Interface**: Clean, modern chat UI for personal knowledge sharing
- **Mode Switching**: Toggle between different conversation styles (Interview, Story, TL;DR, Humble Brag)
- **Sample Questions**: Dynamic question system ready for backend integration
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Built with semantic HTML and ARIA support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # App shell with metadata
│   ├── page.tsx            # Main chat page
│   └── globals.css         # Tailwind + custom CSS
├── components/
│   ├── Header.tsx          # App header with title and avatar
│   ├── ModeSwitcher.tsx    # Conversation mode selector
│   ├── SampleQuestions.tsx # Sample question buttons
│   ├── ChatWindow.tsx      # Chat transcript display
│   ├── MessageBubble.tsx   # Individual message component
│   ├── SourceChips.tsx     # Source badge display
│   ├── Composer.tsx        # Message input component
│   └── SidebarPanel.tsx    # Info and help section
└── lib/
    └── constants.ts        # Type definitions and empty data arrays
```

## UI Components

- **Header**: Sticky header with app title and GitHub icon
- **Mode Switcher**: Segmented control for conversation modes
- **Chat Window**: Scrollable message area with empty state
- **Message Bubbles**: Different styling for user vs assistant messages
- **Source Chips**: Visual badges showing information sources
- **Composer**: Message input form ready for backend integration
- **Sidebar**: Sample questions and information panels

## Current Status

The application is **ready for functionality implementation**:
- ✅ Complete UI components and layout
- ✅ Type definitions and interfaces
- ✅ Props and event handlers prepared
- ✅ No hardcoded demo data
- 🔄 Backend integration needed
- 🔄 API endpoints to be implemented
- 🔄 Data persistence to be added

## Next Steps

To add functionality:
1. ✅ **Backend API implemented** - Chat endpoint at `/api/chat` with RAG capabilities
2. Implement message handling in the Composer component
3. Add state management for chat messages
4. Integrate with backend APIs for responses
5. Add sample questions from backend
6. Implement conversation mode logic
7. Add data persistence and user sessions

Perfect foundation for building a fully functional personal knowledge assistant.

## RAG Implementation

The Personal Codex Agent now includes a **Retrieval-Augmented Generation (RAG)** system that provides contextually accurate responses based on your personal documents.

### How It Works

1. **Question Embedding**: User questions are converted to vectors using OpenAI's `text-embedding-ada-002`
2. **Semantic Search**: Pinecone finds the most relevant document chunks based on semantic similarity
3. **Context Building**: Top 5 relevant chunks are assembled with metadata (title, source, file)
4. **Prompt Engineering**: System combines your question with retrieved context and Matthew's voice/style
5. **AI Generation**: GPT-4o-mini generates responses using only the provided context
6. **Source Attribution**: Each response includes source citations for transparency

### API Endpoint

**POST** `/api/chat`
```json
{
  "message": "What kind of engineer are you?",
  "mode": "interview" // optional: "interview" | "story" | "tldr" | "humblebrag"
}
```

**Response**:
```json
{
  "answer": "Based on my background...",
  "sources": ["Matthew Schramm Resume.pdf", "project-readme.md"]
}
```

### Conversation Modes

- **Interview**: Concise, professional, evaluative responses
- **Story**: Narrative, reflective, first-person when natural
- **TL;DR**: Bullet points and summary format
- **Humble Brag**: Confident but grounded in verifiable context

### Security & Deployment

- **Server-only**: All API keys and secrets remain on the server
- **Environment variables**: Uses `process.env` for configuration
- **TypeScript**: Full type safety and IntelliSense support
- **Error handling**: Proper HTTP status codes and error messages
- **Production ready**: Works locally and after Vercel deployment

## Ingestion Pipeline

The Personal Codex Agent includes a powerful document ingestion system that automatically processes your documents and makes them searchable through AI-powered semantic search.

### Quick Start

1. **Place your documents** in the `/src/data` directory:
   - `.md` files with optional front-matter metadata
   - `.txt` files (plain text)
   - `.pdf` files (automatically parsed)

2. **Set up environment variables** by copying `env.example` to `.env.local`:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   PINECONE_API_KEY=your_pinecone_api_key_here
   PINECONE_INDEX=personal-codex
   PINECONE_ENV=us-east-1
   ```

3. **Run the ingestion script**:
   ```bash
   npm run ingest
   ```

### Document Format Support

#### Markdown Files with Front-matter
```yaml
---
title: "Document Title"
source: "CV" | "Project README" | "Work-Style Notes" | "Doc"
tags: ["tag1", "tag2", "tag3"]
---
# Your content here
```

#### Automatic Metadata Inference
If no front-matter is provided, the system automatically infers:
- **Source**: Based on filename patterns (cv/resume → "CV", readme/project → "Project README", etc.)
- **Title**: Filename without extension
- **Tags**: Empty array (can be added manually later)

### Pinecone Index Requirements

Create a Pinecone index with these settings:
- **Dimension**: 1536 (required for OpenAI text-embedding-ada-002)
- **Metric**: Cosine similarity
- **Environment**: Your preferred Pinecone environment

### Ingestion Features

- **Smart Chunking**: 1200 character chunks with 200 character overlap
- **Batch Processing**: 32 documents per embedding batch for efficiency
- **Idempotent**: Re-running overwrites existing vectors with same IDs
- **Progress Tracking**: Real-time updates on processing status
- **Error Handling**: Graceful fallbacks for malformed documents

### CLI Options

- **Dry Run**: `npm run ingest -- --dry-run` (processes documents without upserting)
- **Clear Existing**: `npm run ingest -- --clear` (removes existing vectors before ingestion)

### Metadata for UI Citations

Each document chunk includes rich metadata:
- `text`: The actual chunk content
- `title`: Human-readable document title
- `source`: Document category (CV, Project README, etc.)
- `tags`: Array of relevant tags
- `file`: Original filename for tracking

This metadata powers the citation system in the chat interface, providing users with source attribution for all AI responses.
