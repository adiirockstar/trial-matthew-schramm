# Matthew's Personal Codex Agent

A sophisticated personal knowledge assistant that uses AI to help you access and query your personal documents and knowledge base. Built with Next.js 15, React 19, and powered by OpenAI GPT-4 for intelligent conversations across multiple modes.

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🎯 Design Choices (System Setup & Rationale)](#-design-choices-system-setup--rationale)
- [❓ Sample Questions & Expected Answers](#-sample-questions--expected-answers)
- [📊 Dataset Management](#-dataset-management)
- [📚 Dataset Explanation (Why These Docs?)](#-dataset-explanation-why-these-docs)
- [🔄 Workflow](#-workflow)
- [🏗️ Technical Architecture](#️-technical-architecture)
- [🔮 What I'd Improve With More Time](#-what-id-improve-with-more-time)
- [🧠 Show Your Thinking (AI-Native Build Artifacts)](#-show-your-thinking-ai-native-build-artifacts)
- [📤 Submission](#-submission)
- [🛠️ Development](#️-development)
- [🐛 Troubleshooting](#-troubleshooting)
- [🧪 Testing](#-testing)
- [📝 Contributing](#-contributing)
- [📄 License](#-license)
- [🆘 Support](#-support)

## ✨ Features

- **Multi-Mode Conversations**: Five distinct conversation styles (Interview, Story, TL;DR, Humble Brag, Self-Reflection)
- **Intelligent Chat Interface**: AI-powered responses with real-time streaming and source attribution
- **Multi-format Document Support**: Handles PDF, Markdown, and Text files with intelligent chunking
- **Vector Search**: Uses Pinecone for efficient semantic document retrieval
- **Real-time Streaming**: Live response generation with progress indicators
- **Source Attribution**: Clickable source chips showing which documents informed each response
- **Easy Dataset Management**: Web-based admin panel for uploading, managing, and updating your knowledge base
- **Incremental Updates**: Smart ingestion that only processes changed files
- **Responsive Design**: Modern UI with Tailwind CSS and Radix UI components
- **Error Handling**: Graceful error handling with retry mechanisms

## 🚀 Quick Start

### 1. Setup Environment

Create a `.env` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX=your_index_name_here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Your Documents

Place your documents in the `src/data/` directory. Supported formats:
- **PDF** (.pdf) - Academic papers, reports, books, resumes
- **Markdown** (.md) - Notes, documentation, articles
- **Text** (.txt) - Simple text documents

### 4. Run Initial Ingestion

```bash
npm run ingest
```

This will process all your documents and create vector embeddings in Pinecone.

### 5. Start the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to start chatting with your knowledge base!

## 🎭 Conversation Modes

The agent supports five distinct conversation styles to match different contexts:

- **Interview Mode**: Professional responses for job interviews and networking
- **Story Mode**: Narrative storytelling about experiences and achievements
- **TL;DR Mode**: Concise, bullet-point summaries of key information
- **Humble Brag Mode**: Confident but modest presentation of accomplishments
- **Self-Reflection Mode**: Introspective analysis of patterns and growth

Each mode uses specialized prompting to generate contextually appropriate responses while maintaining consistency with your personal knowledge base.

## 📊 Dataset Management

### Web Interface

Access the comprehensive admin panel at `/admin` to:
- **Upload new documents** via drag & drop with progress tracking
- **View all dataset files** with metadata and processing status
- **Run ingestion processes** with one-click execution
- **Download or delete files** as needed
- **Monitor ingestion status** in real-time with detailed progress
- **Manage file organization** with automatic categorization

### Command Line Tools

#### Basic Ingestion
```bash
# Process all documents
npm run ingest

# Dry run (see what would be processed)
npm run ingest:dry

# Force reprocess all files
npm run ingest:clear
```

#### Incremental Updates
```bash
# Only process changed/new files
npm run ingest:incremental

# Check dataset status
npm run dataset:status
```

#### Process Specific Files
```bash
# Process only a specific file
npm run ingest:file=document.pdf
```

### File Organization

The system automatically categorizes documents based on filename patterns:

- **CV/Resume**: `cv`, `resume`
- **Portfolio**: `portfolio`
- **Academic**: `transcript`, `literature`, `review`
- **Project**: `readme`, `project`
- **Notes**: `style`, `values`, `notes`

## 🔄 Workflow

### Adding New Documents

1. **Upload**: Use the web interface at `/admin` to upload new files
2. **Process**: Click "Run Ingestion" to process new documents
3. **Chat**: New knowledge is immediately available in your chat

### Updating Existing Documents

1. **Replace**: Upload a new version of the document
2. **Re-ingest**: Run ingestion (automatically detects changes)
3. **Verify**: Check that updates are reflected in chat responses

### Best Practices

- **File Naming**: Use descriptive names that indicate content type
- **Regular Updates**: Run ingestion after adding new documents
- **Backup**: Keep copies of important documents outside the system
- **Metadata**: Use Markdown front-matter for custom categorization

## 🎯 Design Choices (System Setup & Rationale)

- **Next.js + React**: Single repo for UI + API routes; easy Vercel deploy; secrets stay server-side
- **OpenAI GPT-4 / 4o-mini**: Strong quality/latency trade-off; deterministic tone via system prompts
- **Embeddings (text-embedding-3-small)**: Robust semantic search; pairs with 1536-dim index
- **Pinecone (vector DB)**: Managed, quick to set up; free tier fits this project
- **Chunking (≈1200 / overlap 200)**: Balances coherence and recall for CV/notes
- **Modes**: Shows agentic behavior without changing retrieval logic

## ❓ Sample Questions & Expected Answers

**Q1. What kind of engineer are you?**
Expected answer: I am a full-stack developer with a focus on creating scalable business solutions. My expertise spans modern web technologies, including React, Vue.js, Node.js, and Spring Boot. I approach projects with a business-first mindset, aiming to transform complex challenges into elegant digital solutions. My experience includes building responsive applications, optimizing workflows, and mentoring others in the field.

Sources: [Portfolio], [CV]

**Q2. What are your strongest technical skills?**
Expected answer: 
Your strongest technical skills include:

1. **Frontend Development**: 
   - HTML5 (Expert, 90%)
   - CSS3 (Expert, 85%)
   - JavaScript (Expert, 88%)
   - React (Expert, 90%)
   - Vue.js (Advanced, 80%)

2. **Backend Development**: 
   - Python (Expert, 92%)
   - Java (Expert, 85%)
   - Node.js (Expert, 88%)
   - Firebase (Expert, 95%)
   - SQL (Advanced, 88%)

3. **Tools & Management**: 
   - Git (Expert, 94%)
   - Project Management (Expert, 90%)
   - Scrum & Jira (Advanced, 75%)
   - Process Redesign (Expert, 88%)

Your experience spans over three years, focusing on full-stack development and business solutions, with a strong emphasis on creating engaging user experiences and robust server-side solutions.

Sources: [Portfolio], [CV]

**Q3. What projects or experiences are you most proud of?**
Expected Answer: The project I am most proud of is the Amplify platform, a location-based social marketing tool developed in collaboration with Impact.com. This project stands out for its innovative approach to gamifying influencer marketing, integrating six APIs for real-time geolocation validation and automated campaign tracking. I take pride in the responsive dashboards and role-based access control features, which enhance user experience and operational efficiency. The project embodies my commitment to creating scalable, user-focused digital solutions that address real-world challenges.

Sources: Matthew Schramm - Computer Science & IT Student Portfolio, Matthew Schramm Resume.

**Q4. What do you value in a team or company culture?**
Expected Answer:
In a team or company culture, I value:

1. **Clear Communication**: Direct and straightforward interactions without jargon.
2. **Collaboration**: A strong emphasis on teamwork and knowledge sharing across disciplines.
3. **Continuous Learning**: Opportunities for personal and professional development, including peer learning.
4. **User-Centric Approach**: Solutions that prioritize the end-user experience and inclusivity.
5. **Empowerment**: A culture that supports autonomy while providing necessary guidance.
6. **Constructive Feedback**: Honest, actionable feedback that fosters improvement and growth.
7. **Flexibility**: An environment that accommodates different working styles and schedules.
8. **Innovation and Process Optimization**: A focus on simplifying complexity and enhancing system effectiveness.

These values reflect my belief in creating impactful, scalable solutions while fostering a supportive and dynamic work environment.

Sources: [Work-Style Notes], [Academic Transcript]

**Q5. What's your approach to learning or debugging something new?**
Expected answer:
To approach learning or debugging something new, I follow a structured methodology that emphasizes understanding the problem thoroughly before diving into solutions. Here’s a concise breakdown of my approach:

1. **Understand the Problem**: I gather all relevant requirements and context to ensure clarity.
2. **Research Solutions**: I investigate existing patterns and best practices to inform my approach.
3. **Design & Prototype**: I create a plan and build a proof of concept to visualize the solution.
4. **Iterate & Refine**: Based on feedback and testing, I improve the solution iteratively.
5. **Document & Share**: I record my learnings for future reference, ensuring that knowledge is accessible.

I also prefer hands-on practice, as it allows me to learn effectively by doing. Comprehensive documentation is my go-to resource over video tutorials, and I value community learning through discussions with peers.

This method not only aids in effective learning but also aligns with my values of user-centric design, maintainability, and continuous improvement.

Sources: Work Style & Values Notes, Matthew Schramm - Computer Science & IT Student Portfolio.


## 📚 Dataset Explanation (Why These Docs?)

The dataset includes 3-4 representative documents: CV/resume, project README, work-style/values notes, and a literature review I wrote. These documents were chosen because they comprehensively represent my technical skills, project experience, professional voice, and core values. The selection is intentionally concise to maximize signal for retrieval while covering the key dimensions that define my professional identity.

## 🏗️ Technical Architecture

### Frontend Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with modern hooks
- **Styling**: Tailwind CSS 4 with custom animations
- **Components**: Radix UI primitives for accessibility
- **State Management**: React hooks with custom service classes

### AI & Backend

- **Language Model**: OpenAI GPT-4 for intelligent conversations
- **Embeddings**: OpenAI text-embedding-3-small (1536 dimensions)
- **Vector Database**: Pinecone for similarity search
- **File Processing**: PDF.js for PDFs, unified for Markdown parsing

### File Processing Pipeline

- **Chunking**: Documents split into 1200-character chunks with 200-character overlap
- **Embeddings**: Each chunk converted to 1536-dimensional vector
- **Metadata**: Preserves file source, title, chunk information, and processing timestamps
- **Batch Processing**: Processes embeddings in batches of 32 for efficiency

### Performance Features

- **Incremental Updates**: Only processes changed files by default
- **Real-time Streaming**: Live response generation with progress indicators
- **Progress Tracking**: Detailed progress updates during ingestion
- **Error Recovery**: Graceful handling of API failures with retry mechanisms

## 🔮 What I'd Improve With More Time

- **Streaming with inline citation markers** and hover-to-expand snippets
- **Retrieval filters by tags/mode** + re-ranker for better context selection
- **Better PDF cleanup**; semantic sectioning for CV/long documents
- **Better PDF Reading**; some pdf files are not processed if containing certain characters etc.
- **Evaluation harness** (answer faithfulness & coverage metrics)
- **Access control + private deployments** for sensitive documents
- **Observability** (traces, token usage, latency monitoring)
- **Unit tests** for ingestion and prompt templates
- **Redo the UI to represent a full functional codex agent anyone can use**

## 🧠 Show Your Thinking (AI-Native Build Artifacts)

**Prompt Histories & Building Blocks**

Here are concrete examples of how I collaborated with AI coding agents to build this project:

Ingestion Pipeline (scripts/ingest.ts)

Prompt: "Create a standalone ingestion script in TypeScript that reads Markdown, PDF, and text files from /data, chunks them into ~1200 characters with 200 overlap, generates embeddings with OpenAI, and upserts into Pinecone with metadata."
AI Response: Produced a TypeScript script using RecursiveCharacterTextSplitter, OpenAIEmbeddings, and Pinecone client with upsert logic.
Final Code: I adopted the AI’s structure but manually added logging, environment variable handling, and a dry-run mode.


Chat API Route (app/api/chat/route.ts)

Prompt: "Implement a Next.js API route /api/chat that takes a user message, embeds it, queries Pinecone for top-K results, builds a prompt in my voice, and calls gpt-4o-mini. Return both the answer and the source titles."
AI Response: Generated a working route with Pinecone query and OpenAI chat call.
Final Code: I integrated mode preambles, improved error handling, and added UI-friendly source chip formatting.


Conversation Modes (lib/prompt.ts)

Prompt: "Define different conversation modes for my chatbot: Interview, Story, TL;DR, Humble Brag, and Self-Reflection. Each should have a short system prompt string."
AI Response: Suggested style definitions for each mode.
Final Code: I refined the tone descriptions and ensured consistency with my personal voice.

**Instructions, Rules, and Guidance to AI Agents**

I provided my AI agents with clear instructions to ensure responses are consistent, grounded, and aligned with my personal style:

Core System Instructions:

Use only the provided context (no fabrications).

Speak in my voice — concise, friendly, technically precise, reflective.

Always cite sources and acknowledge when info is missing.

Conversation Modes:
Five pre-defined modes (Interview, Story, TL;DR, Humble Brag, Self-Reflection) alter tone while using the same knowledge base.

Retrieval & Prompt Rules:

Use top-5 most relevant chunks, minimum relevance threshold = 0.2.

Structured prompts separate system rules, user question, and retrieved context.

Explicit instruction: “End reply with Sources: <titles>”.

Error Handling & Edge Cases:

Detect greetings and switch to a warmer, conversational system prompt.

Different temperature settings (0.7 for greetings, 0.3 for retrieval) balance creativity and accuracy.

Quality Assurance:

Every response must include source attribution.

Context-aware fallbacks if no relevant docs are found.

These rules reflect my AI-native thinking process: constraint-first design, mode-based specialization, graceful degradation, and transparency by default.

**Conversation Snippets, Commit Messages, and Logs (Prompt → AI Response → Final Code)**

To demonstrate my AI-native workflow, here are concrete examples of how prompts evolved into final production code:

1. Ingestion Pipeline (scripts/ingest.ts)

Prompt: “Create a TypeScript ingestion script that reads Markdown/PDF/TXT files from /data, chunks them (~1200 chars, 200 overlap), generates OpenAI embeddings, and upserts into Pinecone with metadata.”

AI Response: Produced a working script using RecursiveCharacterTextSplitter, OpenAIEmbeddings, and Pinecone upserts.

Final Code: I added env var handling, logging, dry-run mode, and error recovery.

2. Chat API Route (app/api/chat/route.ts)

Prompt: “Implement a Next.js API route /api/chat that embeds user input, queries Pinecone, builds a system prompt in my voice, and calls gpt-4o-mini. Return answer + sources.”

AI Response: Generated a route with Pinecone query + OpenAI chat call.

Final Code: I added mode preambles, greeting detection, relevance thresholding, and UI-friendly tweaks.

3. Conversation Modes (lib/prompt.ts)

Prompt: “Define Interview, Story, TL;DR, Humble Brag, and Self-Reflection modes as system prompts.”

AI Response: Suggested short style definitions.

Final Code: I refined tone, especially Self-Reflection mode, to ensure responses felt personal and growth-oriented.

4. Example Conversation Snippet

User: "What kind of engineer are you?"
Context Retrieved: CV.md + project-readme.md
System Prompt: "You are Matthew’s Personal Codex. Speak in his voice. Cite sources."
AI Response: "I'm a full-stack engineer focused on clean architecture and pragmatic shipping. For example, I built a location-based affiliate system with Vue + Spring Boot. Sources: CV, Project README."


Commit Workflow Pattern

AI scaffold → Manual refinement → Production polish.

Examples: added robust logging to ingestion, tuned temperature in chat, improved tone consistency in prompts.

**Breakdown: AI-Generated vs. Manually Edited Implementation**

My development process followed a clear AI scaffold → Manual refinement → Production polish pattern.

AI Contributions

Generated scaffolding for the ingestion pipeline (scripts/ingest.ts) with chunking, embeddings, and Pinecone upserts.

Produced the initial Chat API route (app/api/chat/route.ts) with query + LLM call.

Suggested mode definitions for conversation styles in lib/prompt.ts.

Basic TypeScript/Next.js patterns, imports, and loops.

*Manual Contributions* 

Added sophisticated error handling, logging, and CLI flags (e.g., --dry-run, incremental re-ingest).

Designed intelligent file categorization and metadata inference.

Implemented greeting detection, relevance thresholds, and graceful fallbacks in the chat API.

Refined conversation modes to reflect my personal tone, especially the Self-Reflection mode.

Built UI components (ChatWindow.tsx, ModeSwitcher.tsx, AdminPanel.tsx) and UX features like streaming indicators, clickable source chips, and retry mechanisms.

Performance optimizations: batch processing, incremental updates, hash-based change detection.

Commit Pattern Analysis

AI generated basic scaffolding.

I added domain expertise (error handling, metadata, UX rules).

Iterated for polish (streaming, user-friendly UI, logging).

Delivered a production-ready system.

**These artifacts demonstrate my AI-native workflow and problem-solving process.**

## 📤 Submission

**Checklist:**
- ✅ **GitHub Repo**: [this repository](https://github.com/yourusername/matthew-schramm-personal-codex-agent)
- ✅ **Deployed App**: https://matthew-schramm-codex-agent.vercel.app
- ✅ **Video Walkthrough (≤5 min)**: https://YOUR-VIDEO-LINK

*The app is public for evaluation; secrets are server-side in API routes.*

## 🛠️ Development

### Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── admin/          # Admin panel pages
│   ├── api/            # API endpoints (chat, dataset, upload, ingest)
│   └── ...
├── components/         # React components
│   ├── ui/            # Reusable UI components (buttons, inputs, etc.)
│   ├── ChatWindow.tsx # Main chat interface
│   ├── Composer.tsx   # Message input component
│   ├── ModeSwitcher.tsx # Conversation mode selector
│   ├── AdminPanel.tsx # Dataset management interface
│   └── ...
├── data/              # Document storage
├── lib/               # Core services and utilities
│   ├── chat-service.ts # AI chat orchestration
│   ├── pine.ts        # Pinecone vector database operations
│   └── ...
└── ...
scripts/
└── ingest.ts          # Document ingestion and processing
```

### Available Scripts

```bash
# Development
npm run dev            # Start development server with Turbopack
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Run ESLint

# Document Management
npm run ingest         # Process all documents
npm run ingest:dry     # Preview what would be processed
npm run ingest:clear   # Force reprocess all files
npm run ingest:incremental # Only process changed files
npm run dataset:status # Check dataset processing status

# Setup (Platform-specific)
npm run setup          # Unix/Linux setup
npm run setup:win      # Windows setup
```

### Adding New Features

1. **New File Types**: Extend `loadDocument()` in `scripts/ingest.ts`
2. **UI Components**: Add to `src/components/` directory
3. **API Endpoints**: Create in `src/app/api/` directory
4. **Metadata**: Extend `DocumentMetadata` interface
5. **Conversation Modes**: Add new modes to `constants.ts`

## 🐛 Troubleshooting

### Common Issues

**Ingestion Fails**
- Check your `.env` file has correct API keys
- Ensure Pinecone index exists and has correct dimensions (1536)
- Verify documents are in supported formats
- Check file permissions in `src/data/` directory

**Files Not Appearing**
- Ensure files have supported extensions (.pdf, .md, .txt)
- Run `npm run ingest:clear` to force reprocessing
- Check browser console for upload errors

**Chat Not Finding Information**
- Verify ingestion completed successfully
- Check Pinecone index has vectors
- Try re-ingesting with `npm run ingest:clear`
- Ensure documents contain relevant content

**Streaming Issues**
- Check OpenAI API key and rate limits
- Verify network connectivity
- Check browser console for errors

### Debug Mode

Enable detailed logging by adding `--dry-run` to see what would be processed:

```bash
npm run ingest:dry
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for personal use. Please respect the privacy and intellectual property of the documents you process.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments for implementation details
3. Open an issue with detailed error information

---

**Ready for artifact documentation! 🚀**

*This README has been finalized to reflect the complete, production-ready state of the Personal Codex Agent. All features, modes, and technical details are now documented and ready for artifact documentation to be added.*
