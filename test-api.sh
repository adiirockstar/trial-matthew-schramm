#!/bin/bash

# Test script for the chat API
# Make sure your Next.js dev server is running first

echo "Testing chat API endpoint..."
echo "=========================="

curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What kind of engineer are you?",
    "mode": "interview"
  }' | jq '.'

echo ""
echo "Test completed!"
