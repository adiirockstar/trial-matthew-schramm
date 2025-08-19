import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ComposerProps {
  onSendMessage?: (message: string) => void;
  disabled?: boolean;
}

export function Composer({ onSendMessage, disabled = false }: ComposerProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input') as HTMLInputElement;
    if (input.value.trim() && onSendMessage) {
      onSendMessage(input.value.trim());
      input.value = '';
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Type a message..."
          className="flex-1"
          disabled={disabled}
        />
        <Button type="submit" size="icon" disabled={disabled}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
