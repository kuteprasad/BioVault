import React, { useState, useRef, useCallback } from 'react';
import { Mic, RefreshCcw, CheckCircle, AlertCircle } from 'lucide-react';

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
    <div className="space-y-3">
      <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Mic className={`w-12 h-12 ${isRecording ? 'text-purple-600 animate-pulse' : 'text-gray-400'}`} />
          {isRecording && (
            <div className="mt-2 text-lg font-semibold text-purple-600">
              {timeLeft}s
            </div>
          )}
          {audioUrl && (
            <div className="w-full px-4">
              <audio 
                src={audioUrl} 
                controls 
                className="w-full h-8 mt-2"
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: '0.5rem'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {!navigator.mediaDevices?.getUserMedia ? (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-700">
              Voice recording not supported
            </p>
          </div>
        </div>
      ) : !audioUrl ? (
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="w-full flex items-center justify-center gap-2 py-2 
            bg-purple-600 text-white rounded-lg hover:bg-purple-700 
            transition-all duration-200 disabled:bg-purple-400 text-sm"
        >
          <Mic className="w-4 h-4" />
          {isRecording ? 'Recording...' : 'Start Recording'}
        </button>
      ) : (
        <div className="flex gap-2">
          <button 
            onClick={resetRecording}
            className="flex-1 flex items-center justify-center gap-2 py-2 
              bg-gray-500 text-white rounded-lg hover:bg-gray-600 
              transition-all duration-200 text-sm"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset
          </button>
          <button 
            onClick={submitRecording}
            disabled={!capturedBlob}
            className="flex-1 flex items-center justify-center gap-2 py-2 
              bg-purple-600 text-white rounded-lg hover:bg-purple-700 
              disabled:bg-purple-400 transition-all duration-200 text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceCapture;