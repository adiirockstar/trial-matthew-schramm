#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Pinecone } from '@pinecone-database/pinecone';
import * as matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toString } from 'mdast-util-to-string';

// Helper function to safely extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return String(error);
}

// Helper function to safely extract error stack trace
function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.stack;
  }
  return undefined;
}

// Load environment variables
dotenv.config({ path: '.env' });

// Settings
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 200;
const BATCH_SIZE = 32;

// CLI flags
const args = process.argv.slice(2);
console.log(`🔍 Debug: process.argv = [${process.argv.join(', ')}]`);
console.log(`🔍 Debug: args = [${args.join(', ')}]`);
const isDryRun = args.includes('--dry-run');
const shouldClear = args.includes('--clear');
const incremental = args.includes('--incremental');
const specificFile = args.find(arg => arg.startsWith('--file='))?.split('=')[1];
console.log(`🔍 Debug: isDryRun = ${isDryRun}, shouldClear = ${shouldClear}, incremental = ${incremental}, specificFile = ${specificFile}`);

interface DocumentMetadata {
  title: string;
  source: string;
  tags: string[];
}

interface Chunk {
  id: string;
  text: string;
  metadata: {
    text: string;
    title: string;
    source: string;
    tags: string[];
    file: string;
    chunkIndex: number;
    totalChunks: number;
  };
}

interface FileInfo {
  path: string;
  name: string;
  size: number;
  lastModified: Date;
  hash: string;
}

// Helper function to generate file hash
async function generateFileHash(filePath: string): Promise<string> {
  const content = fs.readFileSync(filePath);
  const crypto = await import('crypto');
  return crypto.default.createHash('md5').update(content).digest('hex');
}

// Helper function to get file information
async function getFileInfo(filePath: string): Promise<FileInfo> {
  const stats = fs.statSync(filePath);
  return {
    path: filePath,
    name: path.basename(filePath),
    size: stats.size,
    lastModified: stats.mtime,
    hash: await generateFileHash(filePath)
  };
}

// Helper function to check if file needs processing
function needsProcessing(fileInfo: FileInfo, processedFiles: Map<string, string>): boolean {
  if (specificFile && fileInfo.name !== specificFile) {
    return false;
  }
  
  if (incremental) {
    const lastHash = processedFiles.get(fileInfo.name);
    return lastHash !== fileInfo.hash;
  }
  
  return true;
}

// Helper function to infer metadata from filename
function inferMetadata(filename: string): DocumentMetadata {
  const lowerFilename = filename.toLowerCase();
  
  let source = 'Doc';
  if (lowerFilename.includes('cv') || lowerFilename.includes('resume')) {
    source = 'CV';
  } else if (lowerFilename.includes('readme') || lowerFilename.includes('project')) {
    source = 'Project README';
  } else if (lowerFilename.includes('style') || lowerFilename.includes('values') || lowerFilename.includes('notes')) {
    source = 'Work-Style Notes';
  } else if (lowerFilename.includes('transcript')) {
    source = 'Academic Transcript';
  } else if (lowerFilename.includes('portfolio')) {
    source = 'Portfolio';
  } else if (lowerFilename.includes('literature') || lowerFilename.includes('review')) {
    source = 'Literature Review';
  }
  
  return {
    title: filename.replace(/\.[^/.]+$/, ''), // Remove extension
    source,
    tags: []
  };
}

// Parse markdown and extract text
function parseMarkdown(content: string): string {
  const tree = unified().use(remarkParse).parse(content);
  return toString(tree).trim();
}

// Load and parse a document
async function loadDocument(filePath: string): Promise<{ content: string; metadata: DocumentMetadata } | null> {
  const ext = path.extname(filePath).toLowerCase();
  const filename = path.basename(filePath);
  
  try {
    let content = '';
    
    if (ext === '.md' || ext === '.txt') {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Try to parse front-matter
      const parsed = matter.default(fileContent);
      const frontMatter = parsed.data as Partial<DocumentMetadata>;
      
      // Parse markdown to plain text
      content = parseMarkdown(parsed.content);
      
      // Merge front-matter with inferred metadata
      const inferred = inferMetadata(filename);
      const metadata: DocumentMetadata = {
        title: frontMatter.title || inferred.title,
        source: frontMatter.source || inferred.source,
        tags: frontMatter.tags || inferred.tags
      };
      
      return { content, metadata };
      
    } else if (ext === '.pdf') {
      try {
        // Read PDF file as buffer and convert to Uint8Array
        const dataBuffer = fs.readFileSync(filePath);
        const uint8Array = new Uint8Array(dataBuffer);
        
        // Use pdfjs-dist legacy build for Node.js compatibility
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdfDocument = await loadingTask.promise;
        
        // Extract text from all pages
        let fullText = '';
        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
          const page = await pdfDocument.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item) => 'str' in item ? item.str : '')
            .join(' ');
          fullText += pageText + '\n';
        }
        
        content = fullText;
        
        // For PDFs, we can only infer metadata from filename
        const inferred = inferMetadata(filename);
        const metadata: DocumentMetadata = {
          title: inferred.title,
          source: inferred.source,
          tags: inferred.tags
        };
        
        console.log(`  📄 PDF parsed successfully: ${pdfDocument.numPages} pages, ${content.length} characters`);
        return { content, metadata };
        
      } catch (pdfError) {
        console.warn(`  ⚠️  Could not parse PDF ${filename}: ${getErrorMessage(pdfError)}`);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.warn(`⚠️  Warning: Could not read file ${filename}: ${getErrorMessage(error)}`);
    return null;
  }
}

// Normalize text content
function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\n\s*\n/g, '\n\n') // Normalize paragraph breaks
    .trim();
}

// Split text into chunks
async function chunkText(text: string, filename: string): Promise<Chunk[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });
  
  const chunks = await splitter.splitText(text);
  
  return chunks.map((chunk, index) => ({
    id: `${filename}:${String(index).padStart(4, '0')}`,
    text: chunk,
    metadata: {
      text: chunk,
      title: '', // Will be set by caller
      source: '', // Will be set by caller
      tags: [], // Will be set by caller
      file: filename,
      chunkIndex: index,
      totalChunks: chunks.length
    }
  }));
}

// Initialize Pinecone
function initializePinecone() {
  const apiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX;
  
  if (!apiKey || !indexName) {
    throw new Error('Missing required Pinecone environment variables. Please check .env');
  }
  
  try {
    const pinecone = new Pinecone({
      apiKey
    });
    
    return pinecone.Index(indexName);
  } catch (error) {
    throw new Error(`Failed to initialize Pinecone: ${getErrorMessage(error)}`);
  }
}

// Clear existing vectors for files being ingested
async function clearExistingVectors(index: ReturnType<typeof initializePinecone>, filenames: string[]) {
  if (!shouldClear) return;
  
  console.log('🗑️  Clearing existing vectors for files being ingested...');
  
  try {
    // Delete vectors by filtering on metadata.file
    for (const filename of filenames) {
      await index.deleteMany({
        filter: { file: { $eq: filename } }
      });
      console.log(`  ✅ Cleared vectors for ${filename}`);
    }
  } catch (error) {
    console.warn(`⚠️  Warning: Could not clear vectors: ${getErrorMessage(error)}`);
  }
}

// Load processed files tracking
function loadProcessedFiles(): Map<string, string> {
  const trackingFile = path.join(process.cwd(), '.ingest-tracking.json');
  if (fs.existsSync(trackingFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(trackingFile, 'utf-8'));
      return new Map(Object.entries(data));
    } catch (error) {
      console.warn('⚠️  Could not load tracking file, starting fresh');
    }
  }
  return new Map();
}

// Save processed files tracking
function saveProcessedFiles(processedFiles: Map<string, string>) {
  const trackingFile = path.join(process.cwd(), '.ingest-tracking.json');
  const data = Object.fromEntries(processedFiles);
  fs.writeFileSync(trackingFile, JSON.stringify(data, null, 2));
}

// Main ingestion function
async function ingestDocuments() {
  console.log('🚀 Starting document ingestion...\n');
  
  // Check if data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    console.log(`❌ Data directory not found: ${DATA_DIR}`);
    console.log('Please create the data directory and add your documents.');
    process.exit(0);
  }

  // Load tracking for incremental updates
  const processedFiles = loadProcessedFiles();
  
  // Get all document files
  const allFilesPromises = fs.readdirSync(DATA_DIR)
    .filter(file => /\.(md|txt|pdf)$/i.test(file))
    .map(file => path.join(DATA_DIR, file))
    .map(file => getFileInfo(file));

  const allFiles = await Promise.all(allFilesPromises);

  // Filter files that need processing
  const filesToProcess = allFiles.filter(file => needsProcessing(file, processedFiles));
  
  if (filesToProcess.length === 0) {
    console.log('✅ All files are up to date. No processing needed.');
    if (incremental) {
      console.log('Use --clear to force reprocessing of all files.');
    }
    process.exit(0);
  }

  console.log(`📁 Found ${allFiles.length} total files, ${filesToProcess.length} need processing:`);
  filesToProcess.forEach(file => {
    const status = processedFiles.has(file.name) ? '🔄 Updated' : '🆕 New';
    console.log(`  ${status} • ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
  });
  console.log();

  // Load and parse documents
  const documents: Array<{ content: string; metadata: DocumentMetadata; filename: string }> = [];
  
  for (const fileInfo of filesToProcess) {
    const filename = fileInfo.name;
    console.log(`📖 Processing ${filename}...`);
    
    const doc = await loadDocument(fileInfo.path);
    if (doc) {
      console.log(`  🔍 Raw content length: ${doc.content.length} characters`);
      console.log(`  🔍 Raw content preview: "${doc.content.substring(0, 200)}..."`);
      
      const normalizedContent = normalizeText(doc.content);
      console.log(`  🔍 Normalized content length: ${normalizedContent.length} characters`);
      console.log(`  🔍 Normalized content preview: "${normalizedContent.substring(0, 200)}..."`);
      
      if (normalizedContent.length > 0) {
        documents.push({
          content: normalizedContent,
          metadata: doc.metadata,
          filename
        });
        console.log(`  ✅ Loaded ${normalizedContent.length} characters`);
      } else {
        console.log(`  ⚠️  Skipped (empty after normalization)`);
        console.log(`  🔍 Debug: Raw content was "${doc.content}"`);
      }
    }
  }
  
  if (documents.length === 0) {
    console.log('❌ No valid documents to process.');
    process.exit(0);
  }
  
  console.log(`\n📊 Total documents to process: ${documents.length}\n`);
  
  // Chunk documents
  const allChunks: Chunk[] = [];
  
  for (const doc of documents) {
    const chunks = await chunkText(doc.content, doc.filename);
    
    // Set metadata for all chunks
    chunks.forEach(chunk => {
      chunk.metadata.title = doc.metadata.title;
      chunk.metadata.source = doc.metadata.source;
      chunk.metadata.tags = doc.metadata.tags;
    });
    
    allChunks.push(...chunks);
    console.log(`  📝 ${doc.filename}: ${chunks.length} chunks`);
  }
  
  console.log(`\n🔢 Total chunks: ${allChunks.length}`);
  
  console.log(`\n🔍 Debug: isDryRun = ${isDryRun}`);
  
  if (isDryRun) {
    console.log('\n🧪 DRY RUN - No vectors will be created');
    console.log('Run without --dry-run to actually ingest documents');
    console.log(`📊 Summary: ${documents.length} documents processed, ${allChunks.length} chunks created`);
    console.log('\n✅ Dry run completed successfully!');
    process.exit(0);
  }
  
  // Initialize Pinecone
  console.log('\n🌲 Initializing Pinecone...');
  const index = initializePinecone();
  
  // Check index dimensions (friendly warning)
  try {
    const stats = await index.describeIndexStats();
    const dimension = stats.dimension;
    if (dimension !== 1536) {
      console.log(`⚠️  Warning: Index dimension is ${dimension}, expected 1536 for text-embedding-3-small`);
    }
  } catch (error) {
    console.log('⚠️  Warning: Could not verify index dimensions');
  }
  
  // Clear existing vectors if requested
  const filenames = documents.map(d => d.filename);
  await clearExistingVectors(index, filenames);
  
  // Initialize OpenAI embeddings
  console.log('🤖 Initializing OpenAI embeddings...');
  const embeddings = new OpenAIEmbeddings({
    modelName: 'text-embedding-3-small',
    openAIApiKey: process.env.OPENAI_API_KEY
  });
  
  // Process chunks in batches
  console.log('\n📤 Upserting vectors to Pinecone...');
  let processedChunks = 0;
  
  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);
    
    try {
      // Get embeddings for batch
      const vectors = await embeddings.embedDocuments(
        batch.map(chunk => chunk.text)
      );
      
      // Prepare upsert data
      const upsertData = batch.map((chunk, index) => ({
        id: chunk.id,
        values: vectors[index],
        metadata: chunk.metadata
      }));
      
      // Upsert to Pinecone
      await index.upsert(upsertData);
      
      processedChunks += batch.length;
      const progress = ((processedChunks / allChunks.length) * 100).toFixed(1);
      console.log(`  ✅ Processed ${processedChunks}/${allChunks.length} chunks (${progress}%)`);
      
    } catch (error) {
      console.error(`❌ Error processing batch ${i / BATCH_SIZE + 1}: ${getErrorMessage(error)}`);
      throw error;
    }
  }
  
  // Update tracking for successfully processed files
  for (const fileInfo of filesToProcess) {
    processedFiles.set(fileInfo.name, fileInfo.hash);
  }
  saveProcessedFiles(processedFiles);
  
  console.log(`\n🎉 Ingestion complete!`);
  console.log(`📊 Total vectors created: ${processedChunks}`);
  console.log(`📁 Files processed: ${documents.length}`);
  console.log(`🔢 Total chunks: ${allChunks.length}`);
  
  if (incremental) {
    console.log(`\n📝 Tracking file updated. Future runs will only process changed files.`);
    console.log(`Use --clear to force reprocessing of all files.`);
  }
}

// Main execution
async function main() {
  try {
    await ingestDocuments();
  } catch (error) {
    console.error(`\n❌ Fatal error: ${getErrorMessage(error)}`);
    const stackTrace = getErrorStack(error);
    if (stackTrace) {
      console.error('\nStack trace:', stackTrace);
    }
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
