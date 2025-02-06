// routes/userRoutes.js
import express from 'express';
import { updateUserProfile, getUserProfile } from '../controller/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.put('/profile', updateUserProfile);
router.get('/profile', getUserProfile);

export default router;