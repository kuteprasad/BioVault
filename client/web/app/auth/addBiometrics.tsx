import { useState , useEffect} from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { toast } from 'sonner';
import BiometricCapture from '../components/biometrics/BiometricCapture';
import { saveBiometricData } from '~/services/authService';

type BiometricType = 'fingerprint' | 'photo' | 'voice' | null;

const AddBiometrics = () => {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<BiometricType>(null);
  const [loading, setLoading] = useState(false);
  const [addedBiometrics, setAddedBiometrics] = useState<Set<string>>(new Set());

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

      console.log('Biometric data:', data.type);
      console.log('blob data', data.blob);
      console.log('FormData:', formData);

      // Simulating backend upload (Replace with actual API call)
      await saveBiometricData(formData);

      // Add biometric type to state
      setAddedBiometrics((prev) => new Set(prev).add(data.type));

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

  const allBiometricsAdded = addedBiometrics.size === 3;

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

              <div className="flex items-center gap-2">
                {addedBiometrics.has(type) && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {activePanel === type ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </div>
            </button>

            {activePanel === type && (
              <div className="p-4 border-t">
                <BiometricCapture
                  type={type}
                  onSuccess={handleBiometricSuccess}
                  onError={handleBiometricError}
                />
              </div>
            )}
          </div>
        ))}

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 px-4 bg-gray-200 text-gray-600 rounded-lg 
            hover:bg-gray-300 transition-colors duration-200"
          >
            Skip for Now
          </button>

          <button
            onClick={() => navigate('/')} // Navigate after signup
            disabled={!allBiometricsAdded}
            className={`w-full py-2 px-4 rounded-lg transition-colors duration-200
              ${allBiometricsAdded ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-300 text-gray-400 cursor-not-allowed'}
            `}
          >
            Complete Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBiometrics;
