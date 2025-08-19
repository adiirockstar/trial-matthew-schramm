export const MODES = ["Interview", "Story", "TL;DR", "Humble Brag", "Self-Reflection"] as const;

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
  sources: string[];
  mode?: Mode;
  isStreaming?: boolean;
  error?: string;
  tokens?: number;
  latency?: number;
};

export type Mode = typeof MODES[number];

export const SAMPLE_PROMPTS = {
  Interview: "Tell me about your engineering background and what drives you professionally.",
  Story: "Share a memorable story from your career that shaped who you are as an engineer.",
  "TL;DR": "Give me a quick overview of your key technical skills and experience.",
  "Humble Brag": "What achievement are you most proud of, and what did you learn from it?",
  "Self-Reflection": "Based on your experiences, what patterns do you notice about what energizes you versus what drains you in your work?"
} as const;
