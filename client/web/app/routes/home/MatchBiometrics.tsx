import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, XCircle, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { toast } from 'sonner';
import BiometricCapture from '../../components/biometrics/BiometricCapture';
import api from '../../utils/api';

type BiometricType = 'fingerprint' | 'photo' | 'voice';
interface MatchResult {
  percentage: number;
  matched: boolean;
}

const MatchBiometrics = () => {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<BiometricType | null>(null);
  const [loading, setLoading] = useState(false);
  const [matchResults, setMatchResults] = useState<{ [key in BiometricType]?: MatchResult }>({});

  const handlePanelClick = (panel: BiometricType) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const handleBiometricSuccess = async (data: { blob: Blob; type: BiometricType }) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('biometricData', data.blob);
      formData.append('type', data.type);

      // API call to match biometric
      const response = await api.post(`/auth/biometrics/${data.type}/match`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const matchResult: MatchResult = {
        percentage: response.data.matchPercentage,
        matched: response.data.matchPercentage >= 80 // Threshold for match
      };

      setMatchResults(prev => ({ ...prev, [data.type]: matchResult }));
      
      if (matchResult.matched) {
        toast.success(`${data.type} matched successfully! (${matchResult.percentage}% match)`);
      } else {
        toast.error(`${data.type} did not match. (${matchResult.percentage}% match)`);
      }
    } catch (error: any) {
      console.error('Error matching biometric:', error);
      toast.error(`Failed to match ${data.type}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricError = (error: string) => {
    toast.error(error);
    setLoading(false);
  };

  const getMatchStatus = (type: BiometricType) => {
    const result = matchResults[type];
    if (!result) return null;

    return (
      <div className={`flex items-center gap-2 ${
        result.matched ? 'text-green-600' : 'text-red-600'
      }`}>
        {result.matched ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <XCircle className="h-5 w-5" />
        )}
        <span>{result.percentage}% match</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Verify Biometrics</h2>
          <p className="text-gray-500">Verify your identity using biometrics</p>
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

              <div className="flex items-center gap-4">
                {getMatchStatus(type as BiometricType)}
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
                  type={type as BiometricType}
                  onSuccess={handleBiometricSuccess}
                  onError={handleBiometricError}
                />
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg 
            hover:bg-purple-700 transition-colors duration-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchBiometrics;