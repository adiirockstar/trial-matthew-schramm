import { Message } from "@/lib/constants";
import { SourceChips } from "./SourceChips";
import { MessageActions } from "./MessageActions";
import { ErrorRetryChip } from "./ErrorRetryChip";
import { StreamingIndicator } from "./StreamingIndicator";
import { Badge } from "./ui/badge";

interface MessageBubbleProps {
  message: Message;
  onRetry?: () => void;
  onDelete?: () => void;
  onStopStreaming?: () => void;
}

// Function to format AI response text with better formatting
function formatAIResponse(text: string): React.ReactNode {
  // Split text into lines for processing
  const lines = text.split('\n');
  
  return lines.map((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      return <div key={index} className="h-3" />;
    }
    
    // Check for headers (lines ending with colon that are bold)
    if (trimmedLine.endsWith(':') && trimmedLine.includes('**')) {
      const headerText = trimmedLine.replace(/\*\*/g, '');
      return (
        <div key={index} className="mb-3">
          <h4 className="font-semibold text-base text-foreground mb-2 border-b border-border/50 pb-1">
            {headerText}
          </h4>
        </div>
      );
    }
    
    // Check for bold text (wrapped in **)
    if (trimmedLine.includes('**')) {
      const parts = trimmedLine.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={index} className="mb-2">
          {parts.map((part, partIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <span key={partIndex} className="font-semibold text-foreground">
                  {part.slice(2, -2)}
                </span>
              );
            }
            return <span key={partIndex}>{part}</span>;
          })}
        </div>
      );
    }
    
    // Check for lists (lines starting with - or •)
    if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
      const listItem = trimmedLine.substring(1).trim();
      return (
        <div key={index} className="flex items-start gap-2 mb-1 ml-2">
          <span className="text-primary mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
          <span className="text-sm">{listItem}</span>
        </div>
      );
    }
    
    // Check for numbered lists (lines starting with numbers)
    if (/^\d+\./.test(trimmedLine)) {
      const parts = trimmedLine.split(/^(\d+\.)\s*/);
      if (parts.length >= 3) {
        return (
          <div key={index} className="flex items-start gap-2 mb-1 ml-2">
            <span className="text-primary font-medium text-sm flex-shrink-0 min-w-[1.5rem]">
              {parts[1]}
            </span>
            <span className="text-sm">{parts[2]}</span>
          </div>
        );
      }
    }
    
    // Check for TL;DR section
    if (trimmedLine.startsWith('**TL;DR:**')) {
      const tldrText = trimmedLine.replace('**TL;DR:**', '').trim();
      return (
        <div key={index} className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="font-semibold text-primary mb-1">TL;DR</div>
          <div className="text-sm">{tldrText}</div>
        </div>
      );
    }
    
    // Regular paragraph text
    return (
      <div key={index} className="mb-2 text-sm leading-relaxed">
        {trimmedLine}
      </div>
    );
  });
}

export function MessageBubble({ message, onRetry, onDelete, onStopStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`group flex gap-2 lg:gap-3 message-bubble ${isUser ? "justify-end" : "justify-start"} message-enter`}>
      {!isUser && (
        <div className="flex h-6 w-6 lg:h-8 lg:w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs lg:text-sm font-medium">
          A
        </div>
      )}
      
      <div className={`flex max-w-[70ch] flex-col gap-1.5 lg:gap-2 ${isUser ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-1.5 lg:gap-2">
          <span className="text-xs lg:text-sm font-medium">
            {isUser ? "You" : "Matthew's Codex"}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.time}
          </span>
          {!isUser && message.mode && (
            <Badge variant="secondary" className="text-xs">
              {message.mode}
            </Badge>
          )}
        </div>
        
        <div className="relative">
          <div
            className={`rounded-2xl px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm ${
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}
          >
            {isUser ? (
              message.text
            ) : (
              <div className="prose prose-sm max-w-none">
                {formatAIResponse(message.text)}
              </div>
            )}
          </div>
          
          <div className="absolute -top-1 -right-1 z-10">
            <MessageActions
              messageText={message.text}
              onRetry={onRetry}
              onDelete={onDelete}
              isUser={isUser}
            />
          </div>
        </div>
        
        {message.isStreaming && onStopStreaming && (
          <StreamingIndicator
            onStop={onStopStreaming}
            tokens={message.tokens}
            latency={message.latency}
          />
        )}
        
        {message.error && onRetry && (
          <ErrorRetryChip error={message.error} onRetry={onRetry} />
        )}
        
        {!isUser && message.sources && message.sources.length > 0 && (
          <SourceChips sources={message.sources} />
        )}
      </div>
      
      {isUser && (
        <div className="flex h-6 w-6 lg:h-8 lg:w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs lg:text-sm font-medium">
          U
        </div>
      )}
    </div>
  );
}
