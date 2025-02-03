import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, StopCircle } from 'lucide-react';

interface FaceCaptureProps {
  onCapture: (blob: Blob) => void;
  onError: (error: string) => void;
}

const FaceCapture: React.FC<FaceCaptureProps> = ({ onCapture, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedVideo, setCapturedVideo] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsInitialized(false);
  }, []);

  const initializeCamera = async () => {
    console.log('Initializing camera');
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
      console.log('Camera stream obtained', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsInitialized(true);
        console.log('Video element set with stream');
      }
      
    } catch (error) {
      console.error('Camera initialization error:', error);
      onError('Unable to access camera. Please check permissions.');
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      console.log('Stream not available');
      return;
    }

    const options = { mimeType: 'video/webm; codecs=vp9' };
    const mediaRecorder = new MediaRecorder(streamRef.current, options);
    mediaRecorderRef.current = mediaRecorder;

    const chunks: BlobPart[] = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const videoURL = URL.createObjectURL(blob);
      setCapturedVideo(videoURL);
      onCapture(blob);
      stopCamera();
    };

    mediaRecorder.start();
    setIsCapturing(true);
    console.log('Recording started');
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsCapturing(false);
      console.log('Recording stopped');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Component unmounting, stopping camera');
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (isInitialized && videoRef.current) {
      console.log('Video element ready, playing video');
      videoRef.current.play().catch((error) => {
        console.error('Error playing video:', error);
        onError('Error playing video');
      });
    }
  }, [isInitialized, onError]);

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
              console.log('Video metadata loaded');
              if (videoRef.current) {
                videoRef.current.play().catch((error) => {
                  console.error('Error playing video:', error);
                  onError('Error playing video');
                });
              }
            }}
            onError={(e) => {
              console.error('Video error:', e);
              onError('Error playing video');
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

      {capturedVideo && (
        <div className="relative rounded-lg overflow-hidden bg-black">
          <video
            src={capturedVideo}
            controls
            className="w-full"
          />
        </div>
      )}

      <button
        onClick={isInitialized ? (isCapturing ? stopRecording : startRecording) : initializeCamera}
        disabled={isCapturing && !isInitialized}
        className="flex items-center justify-center w-full gap-2 py-3 px-4 bg-purple-600 
          text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 
          transition-colors duration-200"
      >
        <Camera className="w-5 h-5" />
        {isCapturing ? 'Stop Recording' : 
         isInitialized ? 'Start Recording' : 'Start Camera'}
      </button>
    </div>
  );
};

export default FaceCapture;