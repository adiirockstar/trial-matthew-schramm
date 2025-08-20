@echo off
setlocal enabledelayedexpansion

echo 🚀 Matthew's Personal Codex Agent - Setup Script
echo ==================================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  Warning: .env file not found
    echo Please create a .env file with your API keys:
    echo.
    echo OPENAI_API_KEY=your_openai_api_key_here
    echo PINECONE_API_KEY=your_pinecone_api_key_here
    echo PINECONE_INDEX=your_index_name_here
    echo.
    pause
)

REM Check if data directory exists
if not exist "src\data" (
    echo 📁 Creating data directory...
    mkdir "src\data" 2>nul
    echo ✅ Data directory created at src\data\
    echo    Place your documents (PDF, MD, TXT) in this directory
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

REM Check current dataset status
echo.
echo 📊 Current Dataset Status:
echo ==========================

if exist "src\data" (
    set /a file_count=0
    for %%f in (src\data\*.pdf src\data\*.md src\data\*.txt) do (
        set /a file_count+=1
    )
    if !file_count! equ 0 (
        echo    📁 No documents found in src\data\
        echo    💡 Add some documents and run: npm run ingest
    ) else (
        echo    📁 Found !file_count! document(s) in src\data\
        echo    💡 Run: npm run ingest to process documents
    )
) else (
    echo    ❌ Data directory not found
)

echo.
echo 🔧 Available Commands:
echo ======================
echo    npm run ingest          - Process all documents
echo    npm run ingest:dry      - Preview what would be processed
echo    npm run ingest:clear    - Force reprocess all files
echo    npm run ingest:incremental - Only process changed files
echo    npm run dataset:status  - Check dataset status
echo.

echo 🌐 Web Interface:
echo =================
echo    Start the app: npm run dev
echo    Admin panel:  http://localhost:3000/admin
echo    Chat interface: http://localhost:3000
echo.

echo 📚 Next Steps:
echo ===============
echo 1. Add documents to src\data\ directory
echo 2. Run: npm run ingest
echo 3. Start the app: npm run dev
echo 4. Visit /admin to manage your dataset
echo.

echo ✅ Setup complete! Happy knowledge building! 🚀
pause


