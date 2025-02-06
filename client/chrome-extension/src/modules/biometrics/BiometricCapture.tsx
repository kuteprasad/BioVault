import React from 'react';
import FingerprintCapture from './FingerprintCapture';
import FaceCapture from './FaceCapture';
import VoiceCapture from './VoiceCapture';


// Define the type explicitly
export type BiometricType = 'fingerprint' | 'photo' | 'voice';

interface BiometricCaptureProps {
    type: BiometricType;
    onSuccess: (data: { blob: Blob; type: BiometricType }) => void;
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
    }
};

export default BiometricCapture;