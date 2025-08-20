"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { Message, Mode, SAMPLE_PROMPTS } from "@/lib/constants";
import { MessageCircle, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { JumpToLatest } from "./JumpToLatest";
import { useRef, useState, useEffect } from "react";

interface ChatWindowProps {
  messages?: Message[];
  selectedMode?: Mode;
  onRetryMessage?: (messageId: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onStopStreaming?: (messageId: string) => void;
  onStarterPrompt?: (prompt: string) => void;
}

export function ChatWindow({ 
  messages = [], 
  selectedMode = "Interview",
  onRetryMessage,
  onDeleteMessage,
  onStopStreaming,
  onStarterPrompt
}: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [announcement, setAnnouncement] = useState("");

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    
    const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
    setIsAtBottom(atBottom);
    setShowJumpToLatest(!atBottom && scrollTop > 100);
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom]);

  // Announce streaming states for screen readers
  useEffect(() => {
    const streamingMessage = messages.find(m => m.isStreaming);
    if (streamingMessage) {
      setAnnouncement("Assistant is thinking and generating a response...");
    } else {
      setAnnouncement("");
    }
  }, [messages]);

  const getEmptyStateContent = () => {
    const starterPrompt = SAMPLE_PROMPTS[selectedMode];
    
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 text-center p-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <div className="max-w-md space-y-4">
          <h3 className="text-xl font-semibold">
            Start exploring Matthew&apos;s Codex in {selectedMode} mode
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {starterPrompt}
          </p>
          <Button 
            onClick={() => onStarterPrompt?.(starterPrompt)}
            className="mt-4"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Start with this prompt
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
      
      <div className="flex items-center justify-between p-3 lg:p-4 border-b flex-shrink-0">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>

      <ScrollArea 
        className="flex-1 p-3 lg:p-4 min-h-0 overflow-auto touch-auto overscroll-contain" 
        ref={scrollAreaRef}
        onScroll={handleScroll}
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          height: '100%'
        }}
      >
        {messages.length === 0 ? (
          getEmptyStateContent()
        ) : (
          <div className="space-y-4 lg:space-y-6 pb-4">
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message}
                onRetry={() => onRetryMessage?.(message.id)}
                onDelete={() => onDeleteMessage?.(message.id)}
                onStopStreaming={() => onStopStreaming?.(message.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <JumpToLatest 
        onClick={scrollToBottom}
        visible={showJumpToLatest}
      />
    </div>
  );
}
