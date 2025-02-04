import User from '../models/User.js';
import BiometricData from '../models/BiometricData.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cloudinary from '../config/cloudinary.js';

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
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not Found' });
    }

    const isPasswordValid = await bcrypt.compare(masterPassword, user.masterPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    // Include user data in response
    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email
    };

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token, userData });
  } catch (error) {
    console.log("error at login:", error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};

const handlePhotoUpload = async (file) => {
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'biometrics/face' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(file.buffer);
  });

  return {
    face: {
      cloudinaryId: uploadResult.public_id,
      metadata: {
        resolution: `${uploadResult.width}x${uploadResult.height}`,
        format: uploadResult.format
      }
    }
  };
};

const handleVoiceUpload = async (file) => {
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'video', folder: 'biometrics/voice' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(file.buffer);
  });

  return {
    voice: {
      cloudinaryId: uploadResult.public_id,
      metadata: {
        length: `${uploadResult.duration}s`,
        format: uploadResult.format
      }
    }
  };
};

const handleFingerprintUpload = async (file, userId) => {
  return {
    fingerprint: {
      webauthnId: `webauthn_${userId}`,
      publicKey: file.buffer.toString('base64')
    }
  };
};

const saveBiometricData = async (req, res) => {
  const { type } = req.params;
  const file = req.file;
  const userId = req.user.userId;

  try {
    let updateData;
    
    switch(type) {
      case 'photo':
        updateData = await handlePhotoUpload(file);
        break;
      case 'voice':
        updateData = await handleVoiceUpload(file);
        break;
      case 'fingerprint':
        updateData = await handleFingerprintUpload(file, userId);
        break;
      default:
        return res.status(400).json({ message: 'Invalid biometric type' });
    }

    const biometricData = await BiometricData.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { upsert: true, new: true }
    );

    console.log("Updated biometric data:", biometricData);
    res.status(200).json({ message: 'Biometric data saved successfully' });
    
  } catch (error) {
    console.error('Error in saveBiometricData:', error);
    res.status(500).json({ message: 'Error saving biometric data', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    console.log("Getting profile for userId:", req.user.userId);
    const user = await User.findById(req.user.userId).select('-masterPassword');
    
    if (!user) {
      console.log("User not found for ID:", req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log("Found user:", user);
    res.json(user);
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

export { sendOTP, verifyOTP, signup, login, saveBiometricData, getProfile };
