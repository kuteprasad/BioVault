import React, { useState, useEffect } from 'react';
import { Fingerprint } from 'lucide-react';

interface FingerprintCaptureProps {
  onCapture: (blob: Blob) => void;
  onError: (error: string) => void;
}

const FingerprintCapture: React.FC<FingerprintCaptureProps> = ({ onCapture, onError }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      if (window.PublicKeyCredential) {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setIsSupported(available);
      }
    } catch (error) {
      setIsSupported(false);
    }
  };

  const startFingerprintCapture = async () => {
    try {
      setIsCapturing(true);

      // Create challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Define supported algorithms
      const supportedAlgorithms: PublicKeyCredentialParameters[] = [
        { type: 'public-key', alg: -7 },  // ES256
        { type: 'public-key', alg: -257 } // RS256
      ];

      // Create user identity
      const userId = Uint8Array.from('USER_ID', c => c.charCodeAt(0));

      // Create the credential options with proper types
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "Your App Name",
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: "user@example.com",
          displayName: "User Name",
        },
        pubKeyCredParams: supportedAlgorithms,
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
        attestation: 'direct' as AttestationConveyancePreference,
      };

      // Create credentials
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      }) as PublicKeyCredential;

      if (credential) {
        // Convert the credential to a serializable format
        const credentialData = {
          id: credential.id,
          type: credential.type,
          rawId: Array.from(new Uint8Array(credential.rawId)),
        };

        // Convert to blob for consistency with other biometric types
        const credentialJson = JSON.stringify(credentialData);
        const blob = new Blob([credentialJson], { type: 'application/json' });
        onCapture(blob);
      }
    } catch (error) {
      console.error('Fingerprint capture error:', error);
      onError('Failed to capture fingerprint');
    } finally {
      setIsCapturing(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center text-gray-500">
        Fingerprint capture is not supported on this device
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={startFingerprintCapture}
        disabled={isCapturing}
        className="flex items-center justify-center w-full gap-2 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300"
      >
        <Fingerprint className="w-5 h-5" />
        {isCapturing ? 'Scanning...' : 'Scan Fingerprint'}
      </button>
    </div>
  );
};

export default FingerprintCapture;