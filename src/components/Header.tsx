import { Github, Settings, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 lg:h-16 items-center justify-between px-3 lg:px-4">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-xs lg:text-sm">
            MS
          </div>
          <div>
            <h1 className="text-lg lg:text-xl font-bold">Matthew&apos;s Codex</h1>
            <p className="text-xs lg:text-sm text-muted-foreground">Personal knowledge assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 lg:gap-2">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Admin</span>
            </Button>
          </Link>
          <a href="https://github.com/Schramm2" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
          </a>
          <a href="https://www.linkedin.com/in/matthew-schramm-476523253" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </a>
          <a href="mailto:mattschramm1235@gmail.com">
            <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9">
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
