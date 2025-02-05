import { getToken } from '~/utils/authUtils';
import api from '../utils/api';
import axios from 'axios';

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
export const login = async (email: string, masterPassword: string) => {
  try {
    const response = await api.post('/auth/login', { email, masterPassword });
    return response.data; // JWT token returned after successful login
  } catch (error: any) {
    console.log("error in login: ", error);
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
export const saveBiometricData = async (formData: FormData) => {
  try {
    console.log("formData in save bio data: ", formData);
    const token = getToken();

    console.log("reached save bio data");
    const response = await axios.post(`http://localhost:3000/auth/biometrics/${formData.get('type')}`, formData, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("response in save bio data: ", response);
    return response.data;
  } catch (error) {
    console.error("Error in save bio data:", error);
    throw error;
  }
};

export const matchBiometricData = async (formData: FormData) => {
  try {
    // console.log("formData in match bio data: ", formData);
    const token = getToken();

    console.log("reached match bio data");
    const response = await axios.post(`http://localhost:3000/auth/biometrics/${formData.get('type')}/match`, formData, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("response in match bio data: ", response);
    return response;
  } catch (error) {
    console.error("Error in match bio data:", error);
    throw error;
  }
};

// ... existing code ...

// Fetch user profile
export const fetchUserProfile = async () => {
  try {
    const token = getToken();
    console.log("Fetching profile with token:", token ? "Token exists" : "No token");
    
    const response = await api.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log("Profile API response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Profile fetch error in service:", error);
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};
