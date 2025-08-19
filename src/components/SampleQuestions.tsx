import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SampleQuestionsProps {
  questions?: string[];
  onQuestionClick?: (question: string) => void;
}

export function SampleQuestions({ questions = [], onQuestionClick }: SampleQuestionsProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sample Questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start text-left h-auto min-h-[3rem] p-3 whitespace-normal text-wrap"
            onClick={() => onQuestionClick?.(question)}
          >
            <span className="text-sm leading-relaxed">{question}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
