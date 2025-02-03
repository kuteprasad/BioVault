import React, { useState } from 'react';
import { sendOTP } from '../services/authService';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSignup = async () => {
    try {
      // Send registration request to backend (not shown here)
      await sendOTP(email); // Send OTP for email verification
      setIsOtpSent(true);
    } catch (error) {
      console.error('Error Signuping:', error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button onClick={handleSignup}>Signup</button>
      </div>
      {isOtpSent && <p>OTP has been sent to your email. Please verify.</p>}
    </div>
  );
};

export default Signup;
