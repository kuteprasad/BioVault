import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { toast } from 'sonner';
import  BiometricCapture from '../components/biometrics/BiometricCapture';

type BiometricType = 'fingerprint' | 'photo' | 'voice' | null;

const AddBiometrics = () => {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<BiometricType>(null);
  const [loading, setLoading] = useState(false);

  const handlePanelClick = (panel: BiometricType) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const handleBiometricSuccess = async (data: { blob: Blob; type: string }) => {
    try {
      setLoading(true);
      
      // Create FormData and append the blob
      const formData = new FormData();
      formData.append('biometricData', data.blob);
      formData.append('type', data.type);
console.log(data.type)
      // Send to your backend
      const response = await fetch('/biometrics', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload biometric data');
      }
      
      toast.success(`${data.type} biometric added successfully!`);
      setActivePanel(null);
    } catch (error) {
      toast.error(`Failed to save ${data.type} biometric`);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricError = (error: string) => {
    toast.error(error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Add Biometrics</h2>
          <p className="text-gray-500">Choose your biometric authentication methods</p>
        </div>

        {['fingerprint', 'photo', 'voice'].map((type) => (
          <div key={type} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => handlePanelClick(type as BiometricType)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-50"
            >
              <span className="font-medium">
                {type === 'photo' ? 'Face Recognition' : 
                 `${type.charAt(0).toUpperCase()}${type.slice(1)} Authentication`}
              </span>
              {activePanel === type ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
            {activePanel === type && (
              <div className="p-4 border-t">
                <BiometricCapture
                  type={type as BiometricType}
                  onSuccess={handleBiometricSuccess}
                  onError={handleBiometricError}
                />
              </div>
            )}
          </div>
        ))}

        <button
          onClick={() => navigate('/')}
          className="w-full py-2 px-4 bg-gray-200 text-gray-600 rounded-lg 
            hover:bg-gray-300 transition-colors duration-200"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
};

export default AddBiometrics;