import express from 'express';
import { sendOTP, verifyOTP, signup, login, getProfile, refreshAccessToken } from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';
import { matchBiometricData, saveBiometricData } from '../controller/biometricController.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/signup', signup);
router.post('/login', login);

router.post('/biometrics/:type', authMiddleware, upload.single('biometricData'), saveBiometricData);

router.post('/biometrics/:type/match',
    authMiddleware,
    upload.single('biometricData'),
    matchBiometricData
);

router.get('/profile', authMiddleware, getProfile);

export default router;