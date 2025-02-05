import express from 'express';
import { addPassword, updatePassword, getVault, deletePassword } from '../controller/vaultController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all vault routes with authentication
router.use(authMiddleware);

// Vault routes
router.post('/add-password', addPassword);
router.put('/update-password/:passwordId', updatePassword);
router.get('/get-vault', getVault);
router.delete('/delete-password/:passwordId', deletePassword);

export default router; 