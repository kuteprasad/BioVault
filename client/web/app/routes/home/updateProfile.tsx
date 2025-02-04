import { useState, useEffect } from 'react';
import { Mail, User, Lock, ChevronUp, ChevronDown, Fingerprint, Camera, Mic } from 'lucide-react';
import { toast } from 'sonner';
import BiometricCapture from '../../components/biometrics/BiometricCapture';
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";


type Section = 'personal' | 'biometrics' | null;
type BiometricType = 'fingerprint' | 'photo' | 'voice' | null;





export default function UpdateProfile() {
  const user = useSelector((state: RootState) => state.auth.userData);

  const [activeSection, setActiveSection] = useState<Section>(null);
  const [activeBiometric, setActiveBiometric] = useState<BiometricType>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    secondaryEmail: '',
    masterPassword: '',
    otp: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        secondaryEmail: user.secondaryEmail || ''
      }));
    }
  }, [user]);

  const handleSectionClick = (section: Section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleBiometricClick = (type: BiometricType) => {
    setActiveBiometric(activeBiometric === type ? null : type);
  };

  const verifyMasterPassword = async (masterPassword: string) => {
    // API call to verify master password
    console.log(masterPassword);
    setShowPasswordModal(false);
    return true;
  };

  const handleSendOTP = async () => {
    try {
      // API call to send OTP
      setIsOtpSent(true);
      setTimeLeft(60);
      toast.success('OTP sent successfully!');
    } catch (error) {
      toast.error('Failed to send OTP');
    }
  };

  const handleBiometricSuccess = async (data: { blob: Blob; type: string }) => {
    try {
      // API call to update biometric
      toast.success(`${data.type} updated successfully!`);
      setActiveBiometric(null);
    } catch (error) {
      toast.error(`Failed to update ${data.type}`);
    }
  };

  const handleSubmit = async () => {
    if (!formData.masterPassword) {
      toast.error('Master password is required');
      return;
    }

    setIsSubmitting(true);
    try {
      // Verify master password first
      const isValid = await verifyMasterPassword(formData.masterPassword);
      if (!isValid) {
        toast.error('Invalid master password');
        return;
      }

      // Update profile (modify this as per your API)

    //   await updateUserProfile({
    //     fullName: formData.fullName,
    //     secondaryEmail: formData.secondaryEmail
    //   });

      toast.success('Profile updated successfully');
      setShowPasswordModal(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Update Profile</h1>

      {/* Personal Information Section */}
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => handleSectionClick('personal')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-50"
        >
          <span className="font-medium flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </span>
          {activeSection === 'personal' ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {activeSection === 'personal' && (
          <div className="p-6 border-t space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your full name"
              />
            </div>

            {/* Secondary Email with OTP */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Secondary Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={formData.secondaryEmail}
                  onChange={(e) => setFormData({ ...formData, secondaryEmail: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter secondary email"
                />
                <button
                  onClick={handleSendOTP}
                  disabled={isOtpSent}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {isOtpSent ? `Resend (${timeLeft}s)` : 'Send OTP'}
                </button>
              </div>
              {isOtpSent && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter OTP"
                  />
                  <button
                    onClick={() => {/* Verify OTP */}}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Verify
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full mt-4 py-2 px-4 bg-purple-600 text-white rounded-lg 
                hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        )}
      </div>

      {/* Biometrics Section */}
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => handleSectionClick('biometrics')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-50"
        >
          <span className="font-medium flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Update Biometrics
          </span>
          {activeSection === 'biometrics' ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {activeSection === 'biometrics' && (
          <div className="p-6 border-t space-y-4">
            {['fingerprint', 'photo', 'voice'].map((type) => (
              <div key={type} className="border rounded-lg">
                <button
                  onClick={() => handleBiometricClick(type as BiometricType)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-50"
                >
                  <span className="font-medium">
                    {type === 'photo' ? 'Face Recognition' : 
                     `${type.charAt(0).toUpperCase()}${type.slice(1)} Authentication`}
                  </span>
                  {activeBiometric === type ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>

                {activeBiometric === type && (
                  <div className="p-4 border-t">
                    <BiometricCapture
                      type={type}
                      onSuccess={handleBiometricSuccess}
                      onError={(error) => toast.error(error)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Master Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 space-y-4">
            <h3 className="text-lg font-semibold">Enter Master Password</h3>
            <div className="space-y-2">
              <input
                type="password"
                value={formData.masterPassword}
                onChange={(e) => setFormData({ ...formData, masterPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter master password"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg 
                  hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying...' : 'Verify & Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}