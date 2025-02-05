import express from 'express';
import { addPassword, updatePassword, getVault, deletePassword, saveImportedPasswords, getPasswordById } from '../controller/vaultController.js';
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
router.post('/add', addPassword); //done
router.put('/update/:passwordId', updatePassword); //done
router.get('/vault', getVault); //done
router.get('/:passwordId', getPasswordById); // done
router.delete('/delete/:passwordId', deletePassword);
router.post('/import-passwords', saveImportedPasswords); //done


export default router; 