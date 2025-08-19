"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MODES, Mode } from "@/lib/constants";

interface ModeSwitcherProps {
  onModeChange?: (mode: Mode) => void;
  initialMode?: Mode;
}

export function ModeSwitcher({ onModeChange, initialMode = MODES[0] }: ModeSwitcherProps) {
  const [selectedMode, setSelectedMode] = useState<Mode>(initialMode);

  const handleModeChange = (mode: Mode) => {
    setSelectedMode(mode);
    onModeChange?.(mode);
  };

  // Separate conversation modes from agent modes
  const conversationModes = ["Interview", "Story", "TL;DR", "Humble Brag"];
  const agentModes = ["Self-Reflection"];

  return (
    <div className="flex flex-col gap-6">
      {/* Conversation Mode Section */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-muted-foreground">
          Conversation Mode
        </label>
        <div className="flex flex-wrap gap-2">
          {conversationModes.map((mode) => (
            <Button
              key={mode}
              variant={selectedMode === mode ? "default" : "outline"}
              size="sm"
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selectedMode === mode 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => handleModeChange(mode as Mode)}
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>

      {/* Agent Mode Section */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-muted-foreground">
          Agent Mode
        </label>
        <div className="flex flex-wrap gap-2">
          {agentModes.map((mode) => (
            <Button
              key={mode}
              variant={selectedMode === mode ? "default" : "outline"}
              size="sm"
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selectedMode === mode 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => handleModeChange(mode as Mode)}
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
