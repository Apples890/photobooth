import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryPhoto {
  id: string;
  dataUrl: string;
}

export function Gallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gallery');
      if (saved) {
        setPhotos(JSON.parse(saved));
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load photos from storage."
      });
    }
  }, []);

  const downloadPhoto = (dataUrl: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `photo-${Date.now()}.jpg`;
    link.click();
  };

  const deletePhoto = (id: string) => {
    try {
      const newPhotos = photos.filter(photo => photo.id !== id);
      setPhotos(newPhotos);
      localStorage.setItem('gallery', JSON.stringify(newPhotos));
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete photo."
      });
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-4">Photo Strip</h3>
      <ScrollArea className="h-[600px]">
        <div className="flex flex-col gap-6">
          <AnimatePresence>
            {photos.map((photo, index) => (
              <motion.div 
                key={photo.id} 
                className="relative bg-white p-4 shadow-lg rounded-sm group"
                initial={{ 
                  opacity: 0, 
                  y: -50,
                  rotate: -10,
                  scale: 0.8 
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  rotate: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: index * 0.2
                  }
                }}
                exit={{ 
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.2 }
                }}
                style={{
                  aspectRatio: '0.8',
                  maxWidth: '300px'
                }}
              >
                <motion.div
                  className="w-full h-full"
                  whileHover={{ rotate: -2, transition: { duration: 0.2 } }}
                >
                  <img
                    src={photo.dataUrl}
                    alt="captured photo"
                    className="w-full h-[80%] object-cover mb-4"
                    loading="lazy"
                  />
                  <div className="text-center text-sm text-gray-500">
                    {new Date(parseInt(photo.id)).toLocaleDateString()}
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => downloadPhoto(photo.dataUrl)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deletePhoto(photo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}