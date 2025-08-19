import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorRetryChipProps {
  error: string;
  onRetry: () => void;
}

export function ErrorRetryChip({ error, onRetry }: ErrorRetryChipProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in">
      <AlertCircle className="h-4 w-4 text-destructive" />
      <span className="text-sm text-destructive flex-1">{error}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="h-6 px-2 text-xs border-destructive/20 hover:bg-destructive/10 action-button"
        aria-label="Retry message"
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Retry
      </Button>
    </div>
  );
}
