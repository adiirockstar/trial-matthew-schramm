import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function SidebarPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Mobile Collapse Button */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-between"
        >
          <span>Sidebar</span>
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>

      <div className={`space-y-4 lg:space-y-6 ${isCollapsed ? 'lg:block hidden' : 'block'}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
              <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 lg:space-y-4">
            <div className="space-y-2 lg:space-y-3">
              <p className="text-xs lg:text-sm text-muted-foreground">
                Matthew&apos;s Codex is an intelligent personal knowledge assistant that leverages AI to provide 
                instant access to my professional background, skills, and experiences.
              </p>
              
              <div className="space-y-1.5 lg:space-y-2">
                <h4 className="font-medium text-xs lg:text-sm">Key Features:</h4>
                <ul className="text-xs text-muted-foreground space-y-0.5 lg:space-y-1 ml-2">
                  <li>• Multi-mode conversations (Interview, Story, TL;DR, Humble Brag)</li>
                  <li>• Self-reflection prompts for deeper insights</li>
                  <li>• AI-powered document analysis and retrieval</li>
                  <li>• Real-time streaming responses</li>
                  <li>• Comprehensive portfolio and resume access</li>
                </ul>
              </div>

              <div className="space-y-1.5 lg:space-y-2">
                <h4 className="font-medium text-xs lg:text-sm">Technical Stack:</h4>
                <ul className="text-xs text-muted-foreground space-y-0.5 lg:space-y-1 ml-2">
                  <li>• Frontend: Next.js 14, React 18, TypeScript</li>
                  <li>• Styling: Tailwind CSS, shadcn/ui components</li>
                  <li>• AI: OpenAI GPT-4o-mini integration</li>
                  <li>• Vector Database: Pinecone for semantic search</li>
                  <li>• File Processing: PDF, Markdown, and text support</li>
                </ul>
              </div>

              <div className="space-y-1.5 lg:space-y-2">
                <h4 className="font-medium text-xs lg:text-sm">Architecture:</h4>
                <ul className="text-xs text-muted-foreground space-y-0.5 lg:space-y-1 ml-2">
                  <li>• Server-side rendering with Next.js App Router</li>
                  <li>• RESTful API endpoints for chat and file management</li>
                  <li>• Real-time streaming with Server-Sent Events</li>
                  <li>• Responsive design with mobile-first approach</li>
                  <li>• Admin panel for dataset management</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" className="w-full text-xs lg:text-sm">
                View README
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
