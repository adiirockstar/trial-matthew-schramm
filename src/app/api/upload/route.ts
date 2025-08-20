import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'text/markdown', 'text/plain'];
    const allowedExtensions = ['.pdf', '.md', '.txt'];
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
    
    if (!isValidType) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, Markdown, and Text files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB.' },
        { status: 400 }
      );
    }

    // Ensure data directory exists
    const dataDir = join(process.cwd(), 'src', 'data');
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    // Generate safe filename (prevent path traversal)
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = join(dataDir, safeFilename);

    // Check if file already exists and add timestamp if needed
    let finalPath = filePath;
    let counter = 1;
    while (existsSync(finalPath)) {
      const nameWithoutExt = safeFilename.substring(0, safeFilename.lastIndexOf('.'));
      const ext = safeFilename.substring(safeFilename.lastIndexOf('.'));
      finalPath = join(dataDir, `${nameWithoutExt}_${counter}${ext}`);
      counter++;
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(finalPath, buffer);

    return NextResponse.json({
      success: true,
      filename: finalPath.split('/').pop() || finalPath.split('\\').pop(),
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'File upload endpoint. Use POST to upload files.'
  });
}


