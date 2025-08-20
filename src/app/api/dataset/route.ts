import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const dataDir = join(process.cwd(), 'src', 'data');
    
    if (!existsSync(dataDir)) {
      return NextResponse.json({ files: [] });
    }

    const files = await readdir(dataDir);
    const fileStats = await Promise.all(
      files
        .filter(file => /\.(pdf|md|txt)$/i.test(file))
        .map(async (filename) => {
          const filePath = join(dataDir, filename);
          const stats = await stat(filePath);
          
          return {
            name: filename,
            size: stats.size,
            type: getMimeType(filename),
            lastModified: stats.mtime.toISOString(),
            path: filePath
          };
        })
    );

    return NextResponse.json({
      files: fileStats.sort((a, b) => b.lastModified.localeCompare(a.lastModified))
    });

  } catch (error) {
    console.error('Error reading dataset:', error);
    return NextResponse.json(
      { error: 'Failed to read dataset' },
      { status: 500 }
    );
  }
}

function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  switch (ext) {
    case 'pdf':
      return 'application/pdf';
    case 'md':
      return 'text/markdown';
    case 'txt':
      return 'text/plain';
    default:
      return 'application/octet-stream';
  }
}
