export const MODES = ["Interview", "Story", "TL;DR", "Humble Brag"] as const;

export type Message = {
  role: "user" | "assistant";
  text: string;
  time: string;
  sources: string[];
};

export type Mode = typeof MODES[number];
