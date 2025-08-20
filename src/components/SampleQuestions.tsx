import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <CardHeader className="space-y-3 lg:space-y-4">
        <CardTitle className="text-base lg:text-lg">Sample Questions</CardTitle>
        
        {/* Mode Selection - Only show if onModeChange is provided */}
        {onModeChange && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Conversation Mode
            </label>
            <div className="flex flex-wrap gap-1">
              {MODES.filter(mode => mode !== "Self-Reflection").map((mode) => (
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
        )}

        {/* Behavior Toggle */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Question Action
          </label>
          <div className="flex gap-2">
            <Button
              variant={behavior === "insert" ? "default" : "outline"}
              size="sm"
              className="text-xs px-2 lg:px-3 py-1.5 lg:py-2"
              onClick={() => setBehavior("insert")}
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Insert
            </Button>
            <Button
              variant={behavior === "send" ? "default" : "outline"}
              size="sm"
              className="text-xs px-2 lg:px-3 py-1.5 lg:py-2"
              onClick={() => setBehavior("send")}
            >
              <Send className="h-3 w-3 mr-1" />
              Send
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start text-left h-auto min-h-[2.5rem] lg:min-h-[3rem] p-2 lg:p-3 whitespace-normal text-wrap group hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
            onClick={() => handleQuestionAction(question)}
          >
            <span className="text-xs lg:text-sm leading-relaxed">{question}</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {behavior === "insert" ? (
                <Edit3 className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
              ) : (
                <Send className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
              )}
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
