import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Timer, Volume2 } from "lucide-react";

export function Controls() {
  const [countdown, setCountdown] = useState(3);
  const [isMuted, setIsMuted] = useState(false);
  
  return (
    <div className="mt-4 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Timer className="h-4 w-4" />
        <Slider
          value={[countdown]}
          onValueChange={(value) => setCountdown(value[0])}
          min={1}
          max={10}
          step={1}
          className="w-32"
        />
        <span className="text-sm">{countdown}s</span>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMuted(!isMuted)}
      >
        <Volume2 className={isMuted ? "text-muted-foreground" : ""} />
      </Button>
    </div>
  );
}
