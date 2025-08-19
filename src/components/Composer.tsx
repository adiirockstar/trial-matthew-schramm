import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ComposerProps {
  onSendMessage?: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
}

export function Composer({ onSendMessage, disabled = false, placeholder = "Type a message...", isLoading = false }: ComposerProps) {
  const [inputValue, setInputValue] = useState("");
  const [isMultiline, setIsMultiline] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue("");
      setIsMultiline(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Call the send function directly
      if (inputValue.trim() && onSendMessage) {
        onSendMessage(inputValue.trim());
        setInputValue("");
        setIsMultiline(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  // Switch to textarea if content is long
  useEffect(() => {
    if (inputValue.length > 50 && !isMultiline) {
      setIsMultiline(true);
    } else if (inputValue.length <= 50 && isMultiline) {
      setIsMultiline(false);
    }
  }, [inputValue, isMultiline]);

  return (
    <div className="border-t bg-background p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        {isMultiline ? (
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] max-h-[120px] composer-input"
            disabled={disabled}
            rows={1}
          />
        ) : (
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 composer-input"
            disabled={disabled}
          />
        )}
        <Button type="submit" size="icon" disabled={disabled || !inputValue.trim() || isLoading} className="action-button">
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </form>
      <div className="mt-2 text-xs text-muted-foreground text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}
