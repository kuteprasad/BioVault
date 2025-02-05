import express from 'express';
import { addPassword, updatePassword, getVault, deletePassword, saveImportedPasswords } from '../controller/vaultController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Add debug middleware to log all requests
router.use((req, res, next) => {
  console.log('Vault Route accessed:', req.method, req.path);
  next();
});

// Protect all vault routes with authentication
router.use(authMiddleware);

// Vault routes
router.post('/add', addPassword);
router.put('/update/:passwordId', updatePassword);
router.get('/vault', getVault);
router.delete('/delete/:passwordId', deletePassword);
router.post('/import', saveImportedPasswords);


export default router; 