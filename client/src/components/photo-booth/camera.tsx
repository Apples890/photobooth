import { useRef, useEffect, useState } from "react";
import { useCamera } from "@/hooks/use-camera";
import { Button } from "@/components/ui/button";
import { Camera as CameraIcon, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbox } from "./lightbox";
import { motion, AnimatePresence } from "framer-motion";

interface CameraProps {
  filter: string;
  stickers: string[];
  timeGap: number;
}

export function Camera({ filter, stickers, timeGap }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const { 
    startCamera,
    stopCamera,
    takePhoto,
    isLoading,
    error 
  } = useCamera(videoRef, canvasRef);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const captureWithEffect = async () => {
    setShowFlash(true);
    takePhoto();
    await new Promise(resolve => setTimeout(resolve, 150));
    setShowFlash(false);
  };

  const startPhotoSequence = async () => {
    setIsLightboxOpen(true);
    setIsCapturing(true);
    setPhotoCount(0);

    for (let i = 0; i < 4; i++) {
      await new Promise(resolve => setTimeout(resolve, timeGap * 1000));
      await captureWithEffect();
      setPhotoCount(prev => prev + 1);
    }

    setIsCapturing(false);
    setTimeout(() => setIsLightboxOpen(false), 1000);
  };

  if (error) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center p-4 max-w-md">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground mb-4">
            Please ensure you:
            <br />1. Are using a secure (HTTPS) connection
            <br />2. Have a working camera connected
            <br />3. Have granted camera permissions
          </p>
          <Button onClick={startCamera}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const CameraContent = () => (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
          <p>Initializing camera...</p>
        </div>
      )}

      <video
        ref={videoRef}
        className={`w-full aspect-video rounded-lg ${filter}`}
        autoPlay
        playsInline
        muted
      />

      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-20"
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      {stickers.map((sticker, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <img src={sticker} alt="sticker" className="w-16 h-16" />
        </div>
      ))}

      <canvas ref={canvasRef} className="hidden" />

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Button 
          size="lg"
          onClick={startPhotoSequence}
          disabled={isLoading || isCapturing}
        >
          <CameraIcon className="mr-2 h-4 w-4" />
          {isCapturing ? `Taking Photo ${photoCount + 1}/4...` : 'Take 4 Photos'}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {!isLightboxOpen && <CameraContent />}
      <Lightbox isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)}>
        <CameraContent />
      </Lightbox>
    </>
  );
}