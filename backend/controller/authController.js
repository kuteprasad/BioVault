import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';
import dotenv from 'dotenv';

dotenv.config();

const otps = {}; // Temporary storage for OTPs

const sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  otps[email] = otp; // Store OTP in temporary storage
  await sendEmail(email, 'Your OTP Code', `Your OTP code is ${otp}`);
  res.status(200).json({ message: 'OTP sent successfully' });
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (otps[email] && otps[email] === otp) {
    delete otps[email]; // Remove OTP after successful verification
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
};

const signup = async (req, res) => {
  const { fullName, email, masterPassword } = req.body;

  try {
    const user = new User({ fullName, email, masterPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

const login = async (req, res) => {
  const { email, masterPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.masterPassword !== masterPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export { sendOTP, verifyOTP, signup, login };