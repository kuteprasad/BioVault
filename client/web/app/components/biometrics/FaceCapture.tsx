// FaceCapture.tsx
import React, { useRef, useState, useCallback } from 'react';
import { Camera, StopCircle } from 'lucide-react';

interface FaceCaptureProps {
  onCapture: (blob: Blob) => void;
  onError: (error: string) => void;
}

export const FaceCapture: React.FC<FaceCaptureProps> = ({ onCapture, onError }) => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsInitialized(false);
  }, []);

  const initializeCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Camera initialization error:', error);
      onError('Unable to access camera. Please check permissions.');
    }
  };

  const captureFrame = async () => {
    if (!videoRef.current || !streamRef.current) return;

    try {
      setIsCapturing(true);

      // Create a canvas with the video dimensions
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get canvas context');

      // Draw the current frame
      ctx.drawImage(videoRef.current, 0, 0);

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create image blob'));
          },
          'image/jpeg',
          0.9
        );
      });

      onCapture(blob);
      stopCamera();
    } catch (error) {
      console.error('Capture error:', error);
      onError('Failed to capture image');
    } finally {
      setIsCapturing(false);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return (
      <div className="text-center text-red-500">
        Camera access is not supported in this browser
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isInitialized && (
        <div className="relative rounded-lg overflow-hidden bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full"
            onLoadedMetadata={() => {
              if (videoRef.current) {
                videoRef.current.play();
              }
            }}
          />
          <div className="absolute bottom-4 right-4">
            <button
              onClick={stopCamera}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <StopCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={isInitialized ? captureFrame : initializeCamera}
        disabled={isCapturing}
        className="flex items-center justify-center w-full gap-2 py-3 px-4 bg-purple-600 
          text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 
          transition-colors duration-200"
      >
        <Camera className="w-5 h-5" />
        {isCapturing ? 'Processing...' : 
         isInitialized ? 'Capture Photo' : 'Start Camera'}
      </button>
    </div>
  );
};

// Export as default as well
export default FaceCapture;