import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";

interface MessageActionsProps {
  messageText: string;
  onRetry?: () => void;
  onDelete?: () => void;
  isUser?: boolean;
}

export function MessageActions({ messageText, onRetry, onDelete, isUser = false }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity animate-in fade-in bg-background/95 backdrop-blur-sm rounded-lg p-1 shadow-sm border">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-7 w-7 lg:h-6 lg:w-6 p-0 hover:bg-muted action-button"
        title="Copy message"
        aria-label="Copy message"
      >
        <Copy className="h-3 w-3" />
        <span className="sr-only">Copy message</span>
      </Button>
      
      {!isUser && onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="h-7 w-7 lg:h-6 lg:w-6 p-0 hover:bg-muted action-button"
          title="Retry message"
          aria-label="Retry message"
        >
          <RotateCcw className="h-3 w-3" />
          <span className="sr-only">Retry message</span>
        </Button>
      )}
      
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-7 w-7 lg:h-6 lg:w-6 p-0 hover:bg-muted hover:text-destructive action-button"
          title="Delete message"
          aria-label="Delete message"
        >
          <Trash2 className="h-3 w-3" />
          <span className="sr-only">Delete message</span>
        </Button>
      )}
      
      {copied && (
        <span className="text-xs text-muted-foreground ml-2 animate-in fade-in">Copied!</span>
      )}
    </div>
  );
}
