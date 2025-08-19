import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, HelpCircle, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function SidebarPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="space-y-6">
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

      <div className={`space-y-6 ${isCollapsed ? 'lg:block hidden' : 'block'}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5" />
              What is this?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Matthew&apos;s Codex is a personal knowledge assistant that helps you learn about my skills, 
              experience, and values through natural conversation.
            </p>
            <p>
              Think of it as a smart, interactive version of my resume and portfolio.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              How to use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Pick a conversation mode that fits your needs</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Ask questions about my background or skills</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Explore sample questions to get started</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              This application is built with Next.js, Tailwind CSS, and shadcn/ui components. 
              The UI is ready for backend functionality to be implemented.
            </p>
            <Button variant="outline" className="w-full">
              View README
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
