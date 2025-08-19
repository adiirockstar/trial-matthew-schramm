import { Badge } from "@/components/ui/badge";

interface SourceChipsProps {
  sources: readonly string[];
}

export function SourceChips({ sources }: SourceChipsProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {sources.map((source, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="text-xs font-normal"
        >
          {source}
        </Badge>
      ))}
    </div>
  );
}
