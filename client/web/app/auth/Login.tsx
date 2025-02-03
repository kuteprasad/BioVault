import React, { useState } from 'react';
import { sendOTP, verifyOTP } from '../services/authService';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';



const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      await sendOTP(email); // Send OTP request to backend
      setIsOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await verifyOTP(email, otp); // Verify OTP with backend
      login(response.token); // If OTP is correct, log in and set JWT token
      navigate('/home2'); // Redirect to Home2 (authenticated route)
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {!isOtpSent ? (
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
          <button onClick={handleSendOTP}>Send OTP</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button onClick={handleVerifyOTP}>Verify OTP</button>
        </div>
      )}
    </div>
  );
};

export default Login;
