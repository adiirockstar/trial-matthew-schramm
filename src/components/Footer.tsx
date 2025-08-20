import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto w-full">
      <div className="w-full px-3 lg:px-4 py-4 lg:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            {/* Brand Section */}
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="flex h-6 w-6 lg:h-8 lg:w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-xs lg:text-sm">
                MS
              </div>
              <div>
                <h3 className="font-semibold text-sm lg:text-base">Matthew&apos;s Codex</h3>
                <p className="text-xs lg:text-sm text-muted-foreground">Personal knowledge assistant</p>
              </div>
            </div>

            {/* Social & Contact */}
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="flex gap-1 lg:gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7 lg:h-8 lg:w-8">
                  <Github className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 lg:h-8 lg:w-8">
                  <Linkedin className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 lg:h-8 lg:w-8">
                  <Mail className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="sr-only">Email</span>
                </Button>
              </div>
              <div className="text-xs lg:text-sm text-muted-foreground">
                <p>Built with Next.js, OpenAI, and Pinecone</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t">
            <div className="flex flex-col items-center justify-between gap-3 lg:gap-4 text-xs lg:text-sm text-muted-foreground md:flex-row">
              <p>&copy; 2025 Matthew Schramm. All rights reserved.</p>
              <p className="flex items-center gap-1">
                <span>Powered by</span>
                <Button variant="link" size="sm" className="h-auto p-0 text-primary hover:text-primary/80 text-xs lg:text-sm">
                  <span>OpenAI GPT-4o-mini</span>
                  <ExternalLink className="h-2.5 w-2.5 lg:h-3 lg:w-3 ml-1" />
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
