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

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-muted-foreground">
        Conversation Mode
      </label>
      <div className="flex flex-wrap gap-2">
        {MODES.map((mode) => (
          <Button
            key={mode}
            variant={selectedMode === mode ? "default" : "outline"}
            size="sm"
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
              selectedMode === mode 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "hover:bg-muted hover:text-foreground"
            }`}
            onClick={() => handleModeChange(mode)}
          >
            {mode}
          </Button>
        ))}
      </div>
    </div>
  );
}
