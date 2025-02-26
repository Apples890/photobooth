import { STICKERS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StickersProps {
  selected: string[];
  onStickerToggle: (sticker: string) => void;
}

export function Stickers({ selected, onStickerToggle }: StickersProps) {
  return (
    <div>
      <h3 className="font-semibold mb-4">Stickers</h3>
      <ScrollArea className="h-48">
        <div className="grid grid-cols-3 gap-2">
          {STICKERS.map((sticker) => (
            <Button
              key={sticker.id}
              variant={selected.includes(sticker.id) ? "default" : "outline"}
              className="aspect-square"
              onClick={() => onStickerToggle(sticker.id)}
            >
              <img src={sticker.url} alt={sticker.name} className="w-8 h-8" />
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
