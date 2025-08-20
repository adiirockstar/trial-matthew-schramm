# Matthew's Personal Codex Agent

A personal knowledge assistant that uses AI to help you access and query your personal documents and knowledge base.

## Features

- **Intelligent Chat Interface**: Ask questions about your documents and get AI-powered answers
- **Multi-format Support**: Handles PDF, Markdown, and Text files
- **Vector Search**: Uses Pinecone for efficient document retrieval
- **Easy Dataset Management**: Upload, manage, and update your knowledge base through a web interface
- **Incremental Updates**: Smart ingestion that only processes changed files
- **Admin Panel**: Web-based interface for managing your dataset

## Quick Start

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
- **PDF** (.pdf) - Academic papers, reports, books
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

## Dataset Management

### Web Interface

Access the admin panel at `/admin` to:
- **Upload new documents** via drag & drop
- **View all dataset files** with metadata
- **Run ingestion processes** with one click
- **Download or delete files** as needed
- **Monitor ingestion status** in real-time

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

## Workflow

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

## Technical Details

### Architecture

- **Frontend**: Next.js 15 with React 19
- **AI**: OpenAI GPT-4 for chat, text-embedding-3-small for embeddings
- **Vector Database**: Pinecone for similarity search
- **File Processing**: PDF.js for PDFs, unified for Markdown

### File Processing

- **Chunking**: Documents are split into 1200-character chunks with 200-character overlap
- **Embeddings**: Each chunk is converted to a 1536-dimensional vector
- **Metadata**: Preserves file source, title, and chunk information

### Performance

- **Batch Processing**: Processes embeddings in batches of 32
- **Incremental Updates**: Only processes changed files by default
- **Progress Tracking**: Real-time progress updates during ingestion

## Troubleshooting

### Common Issues

**Ingestion Fails**
- Check your `.env` file has correct API keys
- Ensure Pinecone index exists and has correct dimensions (1536)
- Verify documents are in supported formats

**Files Not Appearing**
- Check file permissions in `src/data/` directory
- Ensure files have supported extensions (.pdf, .md, .txt)
- Run `npm run ingest:clear` to force reprocessing

**Chat Not Finding Information**
- Verify ingestion completed successfully
- Check Pinecone index has vectors
- Try re-ingesting with `npm run ingest:clear`

### Debug Mode

Enable detailed logging by adding `--dry-run` to see what would be processed:

```bash
npm run ingest:dry
```

## Development

### Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── admin/          # Admin panel pages
│   ├── api/            # API endpoints
│   └── ...
├── components/         # React components
│   ├── ui/            # UI components
│   └── ...
├── data/              # Document storage
├── lib/               # Utility functions
└── ...
scripts/
└── ingest.ts          # Document ingestion script
```

### Adding New Features

1. **New File Types**: Extend `loadDocument()` in `scripts/ingest.ts`
2. **UI Components**: Add to `src/components/` directory
3. **API Endpoints**: Create in `src/app/api/` directory
4. **Metadata**: Extend `DocumentMetadata` interface

### Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for personal use. Please respect the privacy and intellectual property of the documents you process.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments for implementation details
3. Open an issue with detailed error information

---

**Happy knowledge building! 🚀**
