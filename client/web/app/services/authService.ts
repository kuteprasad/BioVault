import api from '../utils/api';

// Send OTP to email
export const sendOTP = async (email: string) => {
  try {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

// Verify OTP with email
export const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data; // JWT token returned after successful verification
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to verify OTP');
  }
};

// User login with email and password
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // JWT token returned after successful login
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// User signup
export const signup = async (userData: { fullName: string; email: string; masterPassword: string }) => {
  try {
    console.log("userData", userData);
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

// Save biometric data
export const saveBiometricData = async (type: string, data: any) => {
  try {
    const response = await api.post(`/auth/biometrics/${type}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};