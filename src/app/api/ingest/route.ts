import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { join } from 'path';

export async function POST() {
  console.log('🚀 Ingestion process initiated - POST request received');
  
  try {
    // Get the project root directory
    const projectRoot = process.cwd();
    console.log(`📁 Project root directory: ${projectRoot}`);
    
    // Check if package.json exists
    const fs = await import('fs');
    const packageJsonPath = join(projectRoot, 'package.json');
    console.log(`🔍 Checking for package.json at: ${packageJsonPath}`);
    
    if (!fs.existsSync(packageJsonPath)) {
      console.error('❌ Package.json not found - project structure invalid');
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Package.json found - proceeding with ingestion');

    // Run the ingest script using npm run
    console.log('⚡ Starting npm run ingest command...');
    return new Promise<NextResponse>((resolve) => {
      // Use npm run ingest instead of spawning npx directly
      const child = exec('npm run ingest', {
        cwd: projectRoot,
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });

      console.log(`🔄 Ingestion process started with PID: ${child.pid}`);

      let stdout = '';
      let stderr = '';

      if (child.stdout) {
        child.stdout.on('data', (data) => {
          const output = data.toString();
          stdout += output;
          console.log(`📤 Ingestion stdout: ${output.trim()}`);
        });
      }

      if (child.stderr) {
        child.stderr.on('data', (data) => {
          const error = data.toString();
          stderr += error;
          console.log(`⚠️  Ingestion stderr: ${error.trim()}`);
        });
      }

      child.on('close', (code) => {
        console.log(`🏁 Ingestion process completed with exit code: ${code}`);
        if (code === 0) {
          console.log('✅ Ingestion completed successfully');
          console.log(`📊 Final stdout length: ${stdout.length} characters`);
          resolve(NextResponse.json({
            success: true,
            message: 'Ingestion completed successfully',
            output: stdout
          }));
        } else {
          console.error(`❌ Ingestion failed with exit code ${code}`);
          console.error(`📊 Final stderr length: ${stderr.length} characters`);
          resolve(NextResponse.json({
            success: false,
            error: `Ingestion failed with exit code ${code}`,
            output: stdout,
            errorOutput: stderr
          }, { status: 500 }));
        }
      });

      child.on('error', (error) => {
        console.error('💥 Failed to start ingestion process:', error);
        resolve(NextResponse.json({
          success: false,
          error: `Failed to start ingestion process: ${error.message}`
        }, { status: 500 }));
      });

      // Set a timeout to prevent hanging
      console.log('⏰ Setting 5-minute timeout for ingestion process');
      setTimeout(() => {
        console.warn('⏰ Ingestion process timed out after 5 minutes - killing process');
        child.kill();
        resolve(NextResponse.json({
          success: false,
          error: 'Ingestion process timed out'
        }, { status: 500 }));
      }, 300000); // 5 minutes timeout
    });

  } catch (error) {
    console.error('💥 Error running ingestion:', error);
    return NextResponse.json(
      { error: 'Failed to run ingestion process' },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log('ℹ️  Ingestion endpoint GET request received');
  return NextResponse.json({
    message: 'Ingestion endpoint. Use POST to trigger ingestion.'
  });
}
