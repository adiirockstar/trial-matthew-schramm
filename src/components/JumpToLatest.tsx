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
      className="fixed bottom-16 lg:bottom-20 right-3 lg:right-4 z-50 shadow-lg animate-in slide-in-from-bottom-2 text-xs lg:text-sm px-2 lg:px-3 py-1.5 lg:py-2"
    >
      <ArrowDown className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
      Jump to latest
    </Button>
  );
}
