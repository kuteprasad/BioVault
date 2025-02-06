import { FC, useState } from 'react';
import { Camera, Fingerprint, Mic, ChevronDown, ChevronUp } from 'lucide-react';
import BiometricCapture from './biometrics/BiometricCapture';

interface BiometricAuthProps {
  showBiometricAuth: boolean;
  setShowBiometricAuth: (show: boolean) => void;
  onSuccess: (data: { blob: Blob; type: string }) => void;
  onError: (error: string) => void;
}

export const BiometricAuth: FC<BiometricAuthProps> = ({
  showBiometricAuth,
  setShowBiometricAuth,
  onSuccess,
  onError
}) => {
  console.log(setShowBiometricAuth)
  const [activePanel, setActivePanel] = useState<'fingerprint' | 'photo' | 'voice' | null>(null);
  // const [capturedData, setCapturedData] = useState<Blob | null>(null);

  const handlePanelClick = (type: 'fingerprint' | 'photo' | 'voice') => {
    setActivePanel(activePanel === type ? null : type);
    // setCapturedData(null);
  };



  return (
    <>
      {showBiometricAuth && (
        <div className="mt-3 overflow-hidden" style={{ animation: "slideUp 0.3s ease-out forwards" }}>
          <div className="mt-3 p-4 bg-white/80 border shadow-inner border-slate-200 rounded-xl space-y-3">
            {['fingerprint', 'photo', 'voice'].map((type) => (
              <div key={type} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => handlePanelClick(type as 'fingerprint' | 'photo' | 'voice')}
                  className="w-full flex items-center justify-between p-3 text-left 
                    hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {type === 'fingerprint' && <Fingerprint className="w-4 h-4" />}
                    {type === 'photo' && <Camera className="w-4 h-4" />}
                    {type === 'voice' && <Mic className="w-4 h-4" />}
                    <span className="font-medium text-sm">
                      {type.charAt(0).toUpperCase() + type.slice(1)} Auth
                    </span>
                  </div>
                  {activePanel === type ?
                    <ChevronUp className="w-4 h-4" /> :
                    <ChevronDown className="w-4 h-4" />
                  }
                </button>

                {activePanel === type && (
                  <div className="p-3 border-t space-y-3">
                    <BiometricCapture
                      type={type}
                      onSuccess={onSuccess}
                      onError={onError}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};