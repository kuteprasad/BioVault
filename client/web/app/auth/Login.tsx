import React, { useState } from 'react';
import { sendOTP, verifyOTP } from '../services/authService';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      await sendOTP(email);
      setIsOtpSent(true);
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await verifyOTP(email, otp);
      login(response.token);
      toast.success('Login successful!');
      navigate('/home2');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">BioVault</h2>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        {!isOtpSent ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-primary"
                />
              </div>
            </div>
            <button
              onClick={handleSendOTP}
              className="btn-primary"
            >
              Send OTP
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP code"
                className="input-primary"
              />
            </div>
            <button
              onClick={handleVerifyOTP}
              className="btn-primary"
            >
              Verify OTP
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;