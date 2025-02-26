import { useState, useRef, RefObject } from 'react';
import { useToast } from '@/hooks/use-toast';

const MAX_PHOTOS = 4;
const MAX_DIMENSION = 800;

export function useCamera(
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if the browser supports getUserMedia
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Your browser does not support camera access');
      }

      // Request camera access with both front and back camera options
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'user' },
          width: { ideal: MAX_DIMENSION },
          height: { ideal: MAX_DIMENSION }
        },
        audio: false
      }).catch((err) => {
        // Handle specific permission errors
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          throw new Error('Camera permission was denied. Please allow camera access and refresh the page.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          throw new Error('No camera found. Please connect a camera and refresh the page.');
        } else {
          throw new Error('Failed to access camera: ' + err.message);
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Could not access camera';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const compressImage = (canvas: HTMLCanvasElement): string => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const maxDim = Math.max(canvas.width, canvas.height);
    if (maxDim > MAX_DIMENSION) {
      const scale = MAX_DIMENSION / maxDim;
      const scaledCanvas = document.createElement('canvas');
      scaledCanvas.width = canvas.width * scale;
      scaledCanvas.height = canvas.height * scale;
      const scaledCtx = scaledCanvas.getContext('2d');
      if (!scaledCtx) return '';

      scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
      return scaledCanvas.toDataURL('image/jpeg', 0.7);
    }

    return canvas.toDataURL('image/jpeg', 0.7);
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Only take photo if video is playing
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Camera is not ready yet. Please wait a moment."
      });
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0);

    try {
      const compressedDataUrl = compressImage(canvas);
      const savedPhotos = JSON.parse(localStorage.getItem('gallery') || '[]');
      const newPhoto = {
        id: Date.now().toString(),
        dataUrl: compressedDataUrl
      };

      const updatedPhotos = [newPhoto, ...savedPhotos].slice(0, MAX_PHOTOS);
      localStorage.setItem('gallery', JSON.stringify(updatedPhotos));

      toast({
        title: "Success",
        description: "Photo captured!"
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Storage Error",
        description: "Failed to save photo. Storage might be full."
      });
    }
  };

  return {
    startCamera,
    stopCamera,
    takePhoto,
    isLoading,
    error
  };
}