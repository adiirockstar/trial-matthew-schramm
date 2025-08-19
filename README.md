# Matthew's Codex - Personal Knowledge Assistant

A personal knowledge assistant built with Next.js + Tailwind + shadcn/ui. The UI is complete and ready for backend functionality implementation.

## Features

- **Personal Chat Interface**: Clean, modern chat UI for personal knowledge sharing
- **Mode Switching**: Toggle between different conversation styles (Interview, Story, TL;DR, Humble Brag)
- **Sample Questions**: Dynamic question system ready for backend integration
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Built with semantic HTML and ARIA support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # App shell with metadata
│   ├── page.tsx            # Main chat page
│   └── globals.css         # Tailwind + custom CSS
├── components/
│   ├── Header.tsx          # App header with title and avatar
│   ├── ModeSwitcher.tsx    # Conversation mode selector
│   ├── SampleQuestions.tsx # Sample question buttons
│   ├── ChatWindow.tsx      # Chat transcript display
│   ├── MessageBubble.tsx   # Individual message component
│   ├── SourceChips.tsx     # Source badge display
│   ├── Composer.tsx        # Message input component
│   └── SidebarPanel.tsx    # Info and help section
└── lib/
    └── constants.ts        # Type definitions and empty data arrays
```

## UI Components

- **Header**: Sticky header with app title and GitHub icon
- **Mode Switcher**: Segmented control for conversation modes
- **Chat Window**: Scrollable message area with empty state
- **Message Bubbles**: Different styling for user vs assistant messages
- **Source Chips**: Visual badges showing information sources
- **Composer**: Message input form ready for backend integration
- **Sidebar**: Sample questions and information panels

## Current Status

The application is **ready for functionality implementation**:
- ✅ Complete UI components and layout
- ✅ Type definitions and interfaces
- ✅ Props and event handlers prepared
- ✅ No hardcoded demo data
- 🔄 Backend integration needed
- 🔄 API endpoints to be implemented
- 🔄 Data persistence to be added

## Next Steps

To add functionality:
1. Implement message handling in the Composer component
2. Add state management for chat messages
3. Integrate with backend APIs for responses
4. Add sample questions from backend
5. Implement conversation mode logic
6. Add data persistence and user sessions

Perfect foundation for building a fully functional personal knowledge assistant.
