import express from 'express';
import { sendOTP, verifyOTP, signup, login, saveBiometricData } from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';
import { addPassword, updatePassword, getVault, deletePassword } from '../controller/vaultController.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/signup', signup);
router.post('/login', login);
router.post('/biometrics/:type', authMiddleware, upload.single('biometricData'), saveBiometricData);


router.post('/add-password', addPassword);
router.put('/update-password/:passwordId', updatePassword);
router.get('/vault', getVault);
router.delete('/delete-password/:passwordId', deletePassword);


export default router;