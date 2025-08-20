# Matthew's Personal Codex Agent

A sophisticated personal knowledge assistant that uses AI to help you access and query your personal documents and knowledge base. Built with Next.js 15, React 19, and powered by OpenAI GPT-4 for intelligent conversations across multiple modes.

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
