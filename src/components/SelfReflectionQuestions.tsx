import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Edit3, Brain, Users, TrendingUp } from "lucide-react";
import { useState } from "react";

interface SelfReflectionQuestionsProps {
  onQuestionClick?: (question: string) => void;
  onQuestionInsert?: (question: string) => void;
}

export function SelfReflectionQuestions({ 
  onQuestionClick, 
  onQuestionInsert 
}: SelfReflectionQuestionsProps) {
  const [behavior, setBehavior] = useState<"insert" | "send">("insert");

  const reflectionQuestions = [
    {
      icon: <Brain className="h-4 w-4" />,
      category: "Energy & Tasks",
      question: "What kind of tasks energize or drain me?",
      description: "Explore patterns in what motivates and exhausts you"
    },
    {
      icon: <Users className="h-4 w-4" />,
      category: "Collaboration",
      question: "How do I collaborate best with others?",
      description: "Understand your teamwork preferences and communication style"
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      category: "Growth Areas",
      question: "Where do I need to grow?",
      description: "Identify areas for development and improvement"
    }
  ];

  const handleQuestionAction = (question: string) => {
    if (behavior === "insert" && onQuestionInsert) {
      onQuestionInsert(question);
    } else if (behavior === "send" && onQuestionClick) {
      onQuestionClick(question);
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="space-y-3 lg:space-y-4">
        <CardTitle className="text-base lg:text-lg flex items-center gap-2">
          <Brain className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
          Self-Reflection Questions
        </CardTitle>
        
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
      <CardContent className="space-y-2 lg:space-y-3">
        {reflectionQuestions.map((item, index) => (
          <div key={index} className="space-y-1.5 lg:space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-primary">
              {item.icon}
              <span className="uppercase tracking-wide">{item.category}</span>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto min-h-[3.5rem] lg:min-h-[4rem] p-2 lg:p-3 whitespace-normal text-wrap group hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
              onClick={() => handleQuestionAction(item.question)}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="text-xs lg:text-sm font-medium leading-relaxed">{item.question}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {behavior === "insert" ? (
                  <Edit3 className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
                ) : (
                  <Send className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
                )}
              </div>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
