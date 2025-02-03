import React, { useState, useRef, useCallback } from 'react';
import { Mic, Square, RefreshCcw, CheckCircle } from 'lucide-react';

interface VoiceCaptureProps {
  onCapture: (blob: Blob) => void;
  onError: (error: string) => void;
}

const VoiceCapture: React.FC<VoiceCaptureProps> = ({ onCapture, onError }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    setIsRecording(false);
  }, []);

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
        setCapturedBlob(blob);
        
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorder.start(100);
      setIsRecording(true);

      let time = 5;
      setTimeLeft(time);
      timerRef.current = setInterval(() => {
        time -= 1;
        if (time < 0) {
          mediaRecorder.stop();
          cleanupRecording();
          return;
        }
        setTimeLeft(time);
      }, 1000);
    } catch (error) {
      console.error('Recording error:', error);
      onError('Unable to access microphone. Please check permissions.');
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setCapturedBlob(null);
    setTimeLeft(5);
  };

  const submitRecording = () => {
    if (capturedBlob) {
      onCapture(capturedBlob);
    }
  };

  React.useEffect(() => {
    return () => {
      cleanupRecording();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [cleanupRecording, audioUrl]);

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
        {audioUrl && (
          <div className="mt-4">
            <audio src={audioUrl} controls className="w-full" />
          </div>
        )}
      </div>

      {!audioUrl ? (
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="flex items-center justify-center w-full gap-2 py-3 px-4 
            bg-purple-600 text-white rounded-lg hover:bg-purple-700 
            disabled:bg-purple-300 transition-colors duration-200"
        >
          <Mic className="w-5 h-5" />
          Start Recording
        </button>
      ) : (
        <div className="flex gap-4">
          <button 
            onClick={resetRecording}
            className="w-1/2 py-2 bg-gray-500 text-white rounded-lg 
              flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-5 h-5" />
            Recapture
          </button>
          <button 
            onClick={submitRecording}
            disabled={!capturedBlob}
            className="w-1/2 py-2 bg-green-600 text-white rounded-lg 
              disabled:bg-green-300 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceCapture;