import { Message } from "@/lib/constants";
import { SourceChips } from "./SourceChips";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
          A
        </div>
      )}
      
      <div className={`flex max-w-[80%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isUser ? "You" : "Matthew's Codex"}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.time}
          </span>
        </div>
        
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
        >
          {message.text}
        </div>
        
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
