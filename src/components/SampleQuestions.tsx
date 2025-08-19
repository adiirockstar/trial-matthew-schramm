import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { Send, Edit3 } from "lucide-react";
import { Mode, MODES } from "@/lib/constants";

interface SampleQuestionsProps {
  questions?: string[];
  onQuestionClick?: (question: string) => void;
  onQuestionInsert?: (question: string) => void;
  onModeChange?: (mode: Mode) => void;
  selectedMode?: Mode;
}

export function SampleQuestions({ 
  questions = [], 
  onQuestionClick, 
  onQuestionInsert, 
  onModeChange,
  selectedMode = "Interview"
}: SampleQuestionsProps) {
  const [behavior, setBehavior] = useState<"insert" | "send">("insert");

  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sample Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            No sample questions available yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleQuestionAction = (question: string) => {
    if (behavior === "insert" && onQuestionInsert) {
      onQuestionInsert(question);
    } else if (behavior === "send" && onQuestionClick) {
      onQuestionClick(question);
    }
  };

  const handleModeChange = (mode: Mode) => {
    onModeChange?.(mode);
  };

  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle className="text-lg">Sample Questions</CardTitle>
        
        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Conversation Mode
          </label>
          <div className="flex flex-wrap gap-1">
            {MODES.map((mode) => (
              <Button
                key={mode}
                variant={selectedMode === mode ? "default" : "outline"}
                size="sm"
                className={`px-2 py-1 text-xs font-medium transition-all duration-200 ${
                  selectedMode === mode 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => handleModeChange(mode)}
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>

        {/* Behavior Toggle */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Question Action
          </label>
          <ToggleGroup
            type="single"
            value={behavior}
            onValueChange={(value) => value && setBehavior(value as "insert" | "send")}
            className="justify-start"
          >
            <ToggleGroupItem 
              value="insert" 
              size="sm" 
              className={`text-xs px-3 py-2 ${behavior === "insert" ? "bg-primary text-primary-foreground" : ""}`}
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Insert
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="send" 
              size="sm" 
              className={`text-xs px-3 py-2 ${behavior === "send" ? "bg-primary text-primary-foreground" : ""}`}
            >
              <Send className="h-3 w-3 mr-1" />
              Send
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start text-left h-auto min-h-[3rem] p-3 whitespace-normal text-wrap group hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
            onClick={() => handleQuestionAction(question)}
          >
            <span className="text-sm leading-relaxed">{question}</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {behavior === "insert" ? (
                <Edit3 className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Send className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
