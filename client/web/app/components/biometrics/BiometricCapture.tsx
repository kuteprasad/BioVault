import React from 'react';
import FingerprintCapture from './FingerprintCapture';
import FaceCapture from './FaceCapture';
import VoiceCapture from './VoiceCapture';

interface BiometricCaptureProps {
  type: 'fingerprint' | 'photo' | 'voice';
  onSuccess: (data: { blob: Blob; type: string }) => void;
  onError: (error: string) => void;
}

const BiometricCapture: React.FC<BiometricCaptureProps> = ({
  type,
  onSuccess,
  onError,
}) => {
  const handleCapture = (blob: Blob) => {
    onSuccess({ blob, type });
  };

  switch (type) {
    case 'fingerprint':
      return <FingerprintCapture onCapture={handleCapture} onError={onError} />;
    case 'photo':
      return <FaceCapture onCapture={handleCapture} onError={onError} />;
    case 'voice':
      return <VoiceCapture onCapture={handleCapture} onError={onError} />;
    default:
      return null;
  }
};

export default BiometricCapture;