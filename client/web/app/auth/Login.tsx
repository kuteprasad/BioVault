import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import { sendOTP } from '../services/authService';
import type { RootState } from '../redux/store';
import { setToken } from '../utils/authUtils';

import { Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    masterPassword: '',
    otp: ''
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [otpTimer, setOtpTimer] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOtpSent && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      setOtpTimer(timer);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsOtpSent(false);
      toast.error('OTP expired. Please request a new one.');
    }
  }, [isOtpSent, timeLeft]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async () => {
    try {
      if (!formData.email) {
        toast.error('Please enter your email first');
        return;
      }
      await sendOTP(formData.email);
      setIsOtpSent(true);
      setTimeLeft(60);
      toast.success('OTP sent successfully!');
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("formData", formData);
    dispatch(loginUser({ email: formData.email, masterPassword: formData.masterPassword }) as any)
      .unwrap()
      .then((data : any) => {
        setToken(data.token);
        navigate('/');
      })
      .catch((error : any) => {
        toast.error(error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* Master Password Input */}
          <div className="space-y-2">
            <label htmlFor="masterPassword" className="text-sm font-medium text-gray-700">
              Master Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="masterPassword"
                name="masterPassword"
                type="password"
                value={formData.masterPassword}
                onChange={handleInputChange}
                placeholder="Enter master password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* OTP Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                OTP Verification
              </label>
              {isOtpSent && (
                <span className="text-sm text-gray-500">
                  Time remaining: {timeLeft}s
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                id="otp"
                name="otp"
                type="text"
                value={formData.otp}
                onChange={handleInputChange}
                placeholder="Enter OTP"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-900 bg-white"
                disabled={!isOtpSent}
              />
              <button
                type='button'
                onClick={handleSendOTP}
                disabled={isOtpSent}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isOtpSent ? 'OTP Sent' : 'Send OTP'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Log In
            <ArrowRight className="h-4 w-4" />
          </button>
          {error && <p>{error}</p>}

          <div className="text-center">
            <a 
              href="/signup" 
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Don't have an account? Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;