import { Badge } from "@/components/ui/badge";

interface SourceChipsProps {
  sources: readonly string[];
}

export function SourceChips({ sources }: SourceChipsProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 lg:gap-1.5 mt-1.5 lg:mt-2">
      {sources.map((source, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="text-xs font-normal px-1.5 lg:px-2 py-0.5 lg:py-1"
        >
          {source}
        </Badge>
      ))}
    </div>
  );
}
