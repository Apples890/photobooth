import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Camera } from "@/components/photo-booth/camera";
import { Controls } from "@/components/photo-booth/controls";
import { Filters } from "@/components/photo-booth/filters";
import { Gallery } from "@/components/photo-booth/gallery";
import { Stickers } from "@/components/photo-booth/stickers";
import { Slider } from "@/components/ui/slider";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<string>("none");
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [timeGap, setTimeGap] = useState(3);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Photo Booth</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-4">
            <Camera 
              filter={activeFilter}
              stickers={selectedStickers}
              timeGap={timeGap}
            />
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm">Time between photos:</span>
              <Slider
                value={[timeGap]}
                onValueChange={(value) => setTimeGap(value[0])}
                min={1}
                max={10}
                step={1}
                className="w-32"
              />
              <span className="text-sm">{timeGap}s</span>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-4">
              <Filters 
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </Card>

            <Card className="p-4">
              <Stickers
                selected={selectedStickers}
                onStickerToggle={(sticker) => {
                  setSelectedStickers(prev => 
                    prev.includes(sticker)
                      ? prev.filter(s => s !== sticker)
                      : [...prev, sticker]
                  );
                }}
              />
            </Card>
          </div>
        </div>

        <Card className="mt-8 p-4">
          <Gallery />
        </Card>
      </div>
    </div>
  );
}