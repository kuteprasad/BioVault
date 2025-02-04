import express from 'express';
import { sendOTP, verifyOTP, signup, login, saveBiometricData, getProfile } from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/signup', signup);
router.post('/login', login);
router.post('/biometrics/:type', authMiddleware, upload.single('biometricData'), saveBiometricData);
router.get('/profile', authMiddleware, getProfile);
// router.put('/profile', authMiddleware, updateProfile);


export default router;