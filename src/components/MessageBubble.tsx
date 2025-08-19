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

export function MessageBubble({ message, onRetry, onDelete, onStopStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`group flex gap-3 message-bubble ${isUser ? "justify-end" : "justify-start"} message-enter`}>
      {!isUser && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
          A
        </div>
      )}
      
      <div className={`flex max-w-[70ch] flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
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
            className={`rounded-2xl px-4 py-3 text-sm ${
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}
          >
            {message.text}
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
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">
          U
        </div>
      )}
    </div>
  );
}
