import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";

interface StreamingIndicatorProps {
  onStop: () => void;
  tokens?: number;
  latency?: number;
}

export function StreamingIndicator({ onStop, tokens, latency }: StreamingIndicatorProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg animate-in fade-in">
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-primary rounded-full typing-dot" />
          <div className="w-2 h-2 bg-primary rounded-full typing-dot" />
          <div className="w-2 h-2 bg-primary rounded-full typing-dot" />
        </div>
        <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onStop}
        className="ml-auto action-button"
      >
        <Square className="h-3 w-3 mr-1" />
        Stop
      </Button>
      
      {(tokens || latency) && (
        <div className="text-xs text-muted-foreground flex gap-2">
          {tokens && <span>{tokens} tokens</span>}
          {latency && <span>{latency}ms</span>}
        </div>
      )}
    </div>
  );
}
