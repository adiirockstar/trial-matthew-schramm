import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const decodedFilename = decodeURIComponent(filename);
    const dataDir = join(process.cwd(), 'src', 'data');
    const filePath = join(dataDir, decodedFilename);

    // Security check: ensure the file is within the data directory
    if (!filePath.startsWith(dataDir)) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const ext = decodedFilename.toLowerCase().split('.').pop();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'md':
        contentType = 'text/markdown';
        break;
      case 'txt':
        contentType = 'text/plain';
        break;
    }

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${decodedFilename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}
