#!/bin/bash

# Matthew's Personal Codex Agent - Setup Script
# This script helps you set up and manage your personal knowledge base

set -e

echo "🚀 Matthew's Personal Codex Agent - Setup Script"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Please create a .env file with your API keys:"
    echo ""
    echo "OPENAI_API_KEY=your_openai_api_key_here"
    echo "PINECONE_API_KEY=your_pinecone_api_key_here"
    echo "PINECONE_INDEX=your_index_name_here"
    echo ""
    read -p "Press Enter to continue after creating .env file..."
fi

# Check if data directory exists
if [ ! -d "src/data" ]; then
    echo "📁 Creating data directory..."
    mkdir -p src/data
    echo "✅ Data directory created at src/data/"
    echo "   Place your documents (PDF, MD, TXT) in this directory"
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check current dataset status
echo ""
echo "📊 Current Dataset Status:"
echo "=========================="

if [ -d "src/data" ]; then
    file_count=$(find src/data -name "*.pdf" -o -name "*.md" -o -name "*.txt" | wc -l)
    if [ $file_count -eq 0 ]; then
        echo "   📁 No documents found in src/data/"
        echo "   💡 Add some documents and run: npm run ingest"
    else
        echo "   📁 Found $file_count document(s) in src/data/"
        echo "   💡 Run: npm run ingest to process documents"
    fi
else
    echo "   ❌ Data directory not found"
fi

echo ""
echo "🔧 Available Commands:"
echo "======================"
echo "   npm run ingest          - Process all documents"
echo "   npm run ingest:dry      - Preview what would be processed"
echo "   npm run ingest:clear    - Force reprocess all files"
echo "   npm run ingest:incremental - Only process changed files"
echo "   npm run dataset:status  - Check dataset status"
echo ""

echo "🌐 Web Interface:"
echo "================="
echo "   Start the app: npm run dev"
echo "   Admin panel:  http://localhost:3000/admin"
echo "   Chat interface: http://localhost:3000"
echo ""

echo "📚 Next Steps:"
echo "=============="
echo "1. Add documents to src/data/ directory"
echo "2. Run: npm run ingest"
echo "3. Start the app: npm run dev"
echo "4. Visit /admin to manage your dataset"
echo ""

echo "✅ Setup complete! Happy knowledge building! 🚀"


