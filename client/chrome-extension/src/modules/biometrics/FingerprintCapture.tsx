import React, { useState, useEffect } from 'react';
import { Fingerprint, Loader } from 'lucide-react';

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

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Fingerprint 
            className={`w-12 h-12 ${
              isCapturing 
                ? 'text-purple-600 animate-pulse' 
                : 'text-gray-400'
            }`} 
          />
          {isCapturing && (
            <div className="mt-2 text-sm text-purple-600 font-medium">
              Place your finger on the sensor
            </div>
          )}
        </div>
      </div>

      {!isSupported ? (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
          <p className="text-sm text-red-700">
            Fingerprint capture is not supported on this device
          </p>
        </div>
      ) : (
        <button
          onClick={startFingerprintCapture}
          disabled={isCapturing}
          className="w-full flex items-center justify-center gap-2 py-2 
            bg-purple-600 text-white rounded-lg hover:bg-purple-700 
            transition-all duration-200 disabled:bg-purple-400 text-sm"
        >
          {isCapturing ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Fingerprint className="w-4 h-4" />
              Scan Fingerprint
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default FingerprintCapture;