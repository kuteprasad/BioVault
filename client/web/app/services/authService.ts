import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Replace with your backend URL

// Send OTP to email
export const sendOTP = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/send-otp`, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify OTP with email
export const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    return response.data; // JWT token returned after successful verification
  } catch (error) {
    throw error;
  }
};

// User login with email and password
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // JWT token returned after successful login
  } catch (error) {
    throw error;
  }
};

export const signup = async (userData: {
  fullName: string;
  email: string;
  masterPassword: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};