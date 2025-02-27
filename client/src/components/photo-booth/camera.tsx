import { useRef, useState, useEffect } from "react";
import { useCamera } from "@/hooks/use-camera";
import { Button } from "@/components/ui/button";
import { Camera as CameraIcon, RefreshCw } from "lucide-react";

interface CameraProps {
  filter: string;
  stickers: string[];
  countdownSeconds?: number; // Countdown before each photo
}

export function Camera({ filter, stickers, countdownSeconds = 3 }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { startCamera, stopCamera, takePhoto, isLoading, error } = useCamera(videoRef, canvasRef);

  const [isCapturing, setIsCapturing] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const capturePhotos = async () => {
    setIsCapturing(true);
    setPhotoCount(0);

    for (let i = 0; i < 4; i++) {
      // Countdown before each photo
      for (let j = countdownSeconds; j > 0; j--) {
        setCountdown(j);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setCountdown(null); // Hide countdown
      setShowFlash(true);
      takePhoto();
      setPhotoCount(i + 1);

      await new Promise((resolve) => setTimeout(resolve, 500)); // Flash duration
      setShowFlash(false);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Short delay before next countdown
    }

    setIsCapturing(false);
  };

  if (error) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={startCamera}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Camera Access
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Video Feed */}
      <video
        ref={videoRef}
        className={`w-full aspect-video rounded-lg ${filter} ${isLoading ? 'opacity-50' : ''}`}
        autoPlay
        playsInline
        muted
      />

      {/* Countdown Timer Before Each Photo */}
      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold bg-black/60">
          {countdown}
        </div>
      )}

      {/* Flash Effect */}
      {showFlash && <div className="absolute inset-0 bg-white z-20 opacity-60" />}

      {/* Stickers */}
      {stickers.map((sticker, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <img src={sticker} alt="sticker" className="w-16 h-16" />
        </div>
      ))}

      <canvas ref={canvasRef} className="hidden" />

      {/* Capture Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Button size="lg" onClick={capturePhotos} disabled={isLoading || isCapturing}>
          <CameraIcon className="mr-2 h-4 w-4" />
          {isCapturing ? `Capturing Photo ${photoCount}/4...` : `Start Countdown`}
        </Button>
      </div>
    </div>
  );
}
