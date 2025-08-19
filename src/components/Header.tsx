import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
            MS
          </div>
          <div>
            <h1 className="text-xl font-bold">Matthew's Codex</h1>
            <p className="text-sm text-muted-foreground">Personal knowledge assistant</p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Github className="h-4 w-4" />
          <span className="sr-only">GitHub</span>
        </Button>
      </div>
    </header>
  );
}
