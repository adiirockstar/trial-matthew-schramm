import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface JumpToLatestProps {
  onClick: () => void;
  visible: boolean;
}

export function JumpToLatest({ onClick, visible }: JumpToLatestProps) {
  if (!visible) return null;

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onClick}
      className="fixed bottom-20 right-4 z-50 shadow-lg animate-in slide-in-from-bottom-2"
    >
      <ArrowDown className="h-4 w-4 mr-1" />
      Jump to latest
    </Button>
  );
}
