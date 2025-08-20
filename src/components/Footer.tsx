import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          {/* Brand Section */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
              MS
            </div>
            <div>
              <h3 className="font-semibold">Matthew&apos;s Codex</h3>
              <p className="text-sm text-muted-foreground">Personal knowledge assistant</p>
            </div>
          </div>

          {/* Social & Contact */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Built with Next.js, OpenAI, and Pinecone</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>&copy; 2025 Matthew Schramm. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Powered by</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-primary hover:text-primary/80">
                <span>OpenAI GPT-4o-mini</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
