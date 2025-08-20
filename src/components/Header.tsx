import { Github, Settings, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-12 sm:h-14 lg:h-16 items-center justify-between px-2 sm:px-3 lg:px-4">
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-xs sm:text-sm lg:text-base">
            MS
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg lg:text-xl font-bold truncate">Matthew&apos;s Codex</h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground truncate">Personal knowledge assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-2">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9">
              <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">Admin</span>
            </Button>
          </Link>
          <a href="https://github.com/Schramm2" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9">
              <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
          </a>
          <a href="https://www.linkedin.com/in/matthew-schramm-476523253" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9">
              <Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </a>
          <a href="mailto:mattschramm1235@gmail.com">
            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9">
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">Email</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
