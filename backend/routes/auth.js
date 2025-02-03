import express from 'express';
import { sendOTP, verifyOTP, signup, login } from '../controller/authController.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/signup', signup);
router.post('/login', login);

export default router;