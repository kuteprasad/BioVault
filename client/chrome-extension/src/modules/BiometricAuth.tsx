import { FC, useState } from "react";
import {
  Camera,
  Fingerprint,
  Mic,
  ChevronDown,
  ChevronUp,
  Loader,
} from "lucide-react";
import BiometricCapture from "./biometrics/BiometricCapture";

interface BiometricAuthProps {
  showBiometricAuth: boolean;
  setShowBiometricAuth: (show: boolean) => void;
  onSuccess: (data: { blob: Blob; type: string }) => void;
  onError: (error: string) => void;
  bioAuthendicated: boolean;
}

export const BiometricAuth: FC<BiometricAuthProps> = ({
  showBiometricAuth,
  setShowBiometricAuth,
  onSuccess,
  onError,
  bioAuthendicated,
}) => {
  console.log(setShowBiometricAuth);
  console.log("bioAuthResponssdsdfsdfde", bioAuthendicated);
  const [activePanel, setActivePanel] = useState<
    "fingerprint" | "photo" | "voice" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [capturedData, setCapturedData] = useState<Blob | null>(null);

  const handlePanelClick = (type: "fingerprint" | "photo" | "voice") => {
    setActivePanel(activePanel === type ? null : type);
   
  };

  const handleCaptureSuccess = (data: { blob: Blob; type: string }) => {
    setIsLoading(true);
    onSuccess(data);
  };

  const handleCaptureError = (error: string) => {
    setIsLoading(false);
    onError(error);
  };

  return (
    <>
      {showBiometricAuth && (
        <div
          className="mt-3 overflow-hidden"
          style={{ animation: "slideUp 0.3s ease-out forwards" }}
        >
          <div className="mt-3 p-4 bg-white/80 border shadow-inner border-slate-200 rounded-xl space-y-3">
            {["fingerprint", "photo", "voice"].map((type) => (
              <div key={type} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    handlePanelClick(type as "fingerprint" | "photo" | "voice")
                  }
                  className={`w-full flex items-center justify-between p-3 text-left transition-colors
                    ${
                      bioAuthendicated
                        ? "bg-green-50 hover:bg-green-100"
                        : "hover:bg-purple-50"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {type === "fingerprint" && (
                      <Fingerprint className="w-4 h-4" />
                    )}
                    {type === "photo" && <Camera className="w-4 h-4" />}
                    {type === "voice" && <Mic className="w-4 h-4" />}
                    <span className="font-medium text-sm">
                      {type.charAt(0).toUpperCase() + type.slice(1)} Auth
                    </span>
                  </div>
                  {activePanel === type ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {activePanel === type && (
                  <div className="p-3 border-t space-y-3">
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <Loader className="w-6 h-6 animate-spin" />
                      </div>
                    ) : (
                      <BiometricCapture
                        type={type}
                        onSuccess={handleCaptureSuccess}
                        onError={handleCaptureError}
                      />
                    )}
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
