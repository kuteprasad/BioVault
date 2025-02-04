import User from '../models/User.js';

import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';


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
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(masterPassword, 10);

    // Create a new user
    const user = new User({ fullName, email, masterPassword: hashedPassword });
    console.log("user", user);

    // Save the user to the database
    await user.save();

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.log("error at signup:", error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error });
    }

    // Handle other errors
    res.status(500).json({ message: 'Error registering user', error });
  }
};

const login = async (req, res) => {
  const { email, masterPassword } = req.body;
  console.log("data in login: ", req.body);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not Found' });
    }

    console.log("user in login:", user);
    console.log("masterPassword in login:", user.masterPassword);

    const isPasswordValid = await bcrypt.compare(masterPassword, user.masterPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    console.log("login successfull from backend");
    res.status(200).json({ token });
  } catch (error) {

    console.log("error at login:", error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};


export { 
  sendOTP, 
  verifyOTP, 
  signup, 
  login
};