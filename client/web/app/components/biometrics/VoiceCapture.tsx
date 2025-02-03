// VoiceCapture.tsx
import React, { useState, useRef, useCallback } from 'react';
import { Mic, Square } from 'lucide-react';

interface VoiceCaptureProps {
  onCapture: (blob: Blob) => void;
  onError: (error: string) => void;
}

 const VoiceCapture: React.FC<VoiceCaptureProps> = ({ onCapture, onError }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    streamRef.current = null;
    mediaRecorderRef.current = null;
    setIsRecording(false);
    setTimeLeft(5);
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { 
          type: mediaRecorder.mimeType 
        });
        onCapture(blob);
        
        // Create preview URL
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);

      // Start countdown
      let time = 5;
      setTimeLeft(time);
      timerRef.current = setInterval(() => {
        time -= 1;
        setTimeLeft(time);
        if (time === 0) {
          stopRecording();
        }
      }, 1000);
    } catch (error) {
      console.error('Recording error:', error);
      onError('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      cleanupRecording();
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      cleanupRecording();
    };
  }, [cleanupRecording]);

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return (
      <div className="text-center text-red-500">
        Voice recording is not supported in this browser
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        {isRecording && (
          <div className="text-2xl font-bold text-purple-600 animate-pulse">
            Recording: {timeLeft}s
          </div>
        )}
        {audioUrl && !isRecording && (
          <div className="mt-4">
            <audio src={audioUrl} controls className="w-full" />
          </div>
        )}
      </div>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={timeLeft === 0}
        className="flex items-center justify-center w-full gap-2 py-3 px-4 
          bg-purple-600 text-white rounded-lg hover:bg-purple-700 
          disabled:bg-purple-300 transition-colors duration-200"
      >
        {isRecording ? (
          <>
            <Square className="w-5 h-5" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            Start Recording
          </>
        )}
      </button>
    </div>
  );
};

// Export as default as well
export default VoiceCapture;