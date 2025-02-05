import Vault from '../models/Vault.js';
import User from '../models/User.js';
import crypto from 'crypto';
import { encryptionService } from '../utils/encryption.js';

export const addPassword = async (req, res) => {
  const userId = req.user.userId;
  console.log('Adding password for user:', userId);
  const { site, username, passwordEncrypted, notes } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const vault = await Vault.findOne({ userId });
    if (!vault) {
      return res.status(404).json({ message: 'Vault not found' });
    }

    // Log original password (for development only)
    console.log('Original password:', passwordEncrypted);

    // Encrypt the password
    const encryptedPassword = encryptionService.encrypt(passwordEncrypted);
    
    // Log encrypted password
    console.log('Encrypted password:', encryptedPassword);

    const newPassword = {
      site,
      username,
      passwordEncrypted: encryptedPassword,
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    vault.passwords.push(newPassword);
    await vault.save();

    // Verify encryption by fetching the saved password
    const savedVault = await Vault.findOne({ userId });
    const lastPassword = savedVault.passwords[savedVault.passwords.length - 1];
    console.log('Saved encrypted password:', lastPassword.passwordEncrypted);

    // Try decrypting to verify
    const decryptedPassword = encryptionService.decrypt(lastPassword.passwordEncrypted);
    console.log('Decrypted password:', decryptedPassword);
    console.log('Encryption successful:', decryptedPassword === passwordEncrypted);

    console.log('Password added successfully');
    res.status(201).json({ 
      message: 'Password added successfully',
      vault: {
        ...vault.toObject(),
        passwords: vault.passwords.map(p => ({
          ...p.toObject(),
          passwordEncrypted: '******' // Hide encrypted passwords in response
        }))
      }
    });
  } catch (error) {
    console.error('Error adding password:', error);
    res.status(500).json({ 
      message: 'Error adding password', 
      error: error.message 
    });
  }
};

export const updatePassword = async (req, res) => {
  const userId = req.user.userId;
  console.log('Updating password for user:', userId);
  const { site, username, passwordEncrypted, notes } = req.body;
  const { passwordId } = req.params;

  try {
    const vault = await Vault.findOne({ userId });
    if (!vault) {
      return res.status(404).json({ message: 'Vault not found' });
    }

    const passwordEntry = vault.passwords.id(passwordId);
    if (!passwordEntry) {
      return res.status(404).json({ message: 'Password entry not found' });
    }

    // Only encrypt if a new password is provided
    if (passwordEncrypted) {
      console.log('Encrypting new password');
      passwordEntry.passwordEncrypted = encryptionService.encrypt(passwordEncrypted);
    }
    
    // Update other fields
    if (site) passwordEntry.site = site;
    if (username) passwordEntry.username = username;
    if (notes) passwordEntry.notes = notes;
    passwordEntry.updatedAt = new Date();

    await vault.save();

    // Return the updated vault with the decrypted password for the updated entry
    const updatedVault = await Vault.findOne({ userId });
    const updatedPasswordEntry = updatedVault.passwords.id(passwordId);

    const response = {
      message: 'Password updated successfully',
      vault: {
        ...updatedVault.toObject(),
        passwords: updatedVault.passwords.map(p => ({
          ...p.toObject(),
          passwordEncrypted: p._id.toString() === passwordId 
            ? encryptionService.decrypt(p.passwordEncrypted)
            : '******'
        }))
      }
    };

    console.log('Password updated successfully');
    res.status(200).json(response);
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ 
      message: 'Error updating password', 
      error: error.message 
    });
  }
};

export const getVault = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching vault for user:', userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const vault = await Vault.findOne({ userId });
    if (!vault) {
      console.log('No vault found, creating new vault');
      const encryptionKey = crypto.randomBytes(32).toString('hex');
      const newVault = new Vault({ 
        userId, 
        passwords: [], 
        encryption_key: encryptionKey 
      });
      await newVault.save();
      return res.status(200).json({ vault: newVault });
    }

    // Safely decrypt passwords, handling both encrypted and non-encrypted data
    const decryptedVault = {
      ...vault.toObject(),
      passwords: vault.passwords.map(p => {
        try {
          // Check if the password is encrypted (contains the IV separator ':')
          const isEncrypted = p.passwordEncrypted.includes(':');
          return {
            ...p.toObject(),
            passwordEncrypted: isEncrypted 
              ? encryptionService.decrypt(p.passwordEncrypted)
              : p.passwordEncrypted // Return as-is if not encrypted
          };
        } catch (error) {
          console.log('Decryption failed for a password, returning masked value');
          return {
            ...p.toObject(),
            passwordEncrypted: '******' // Mask passwords that can't be decrypted
          };
        }
      })
    };

    console.log('Vault found with', vault.passwords.length, 'passwords');
    res.status(200).json({ vault: decryptedVault });
  } catch (error) {
    console.error('Error retrieving vault:', error);
    res.status(500).json({ message: 'Error retrieving vault', error: error.message });
  }
};

export const getPasswordById = async (req, res) => {
  const userId = req.user.userId;
  const { passwordId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const vault = await Vault.findOne({ userId });
    if (!vault) {
      return res.status(404).json({ message: 'Vault not found' });
    }

    const passwordEntry = vault.passwords.id(passwordId);
    if (!passwordEntry) {
      return res.status(404).json({ message: 'Password entry not found' });
    }

    try {

      const isEncrypted = passwordEntry.passwordEncrypted.includes(':');

      // Decrypt the password
      // const decryptedPassword = encryptionService.decrypt(passwordEntry.passwordEncrypted);
      console.log('Is encrypted:', isEncrypted);
      console.log('Password entry:', passwordEntry);
      console.log('Password encrypted:', passwordEntry.passwordEncrypted);
      // Create response object with decrypted password
      const decryptedEntry = {
        ...passwordEntry.toObject(),
        passwordEncrypted: isEncrypted 
          ? encryptionService.decrypt(passwordEntry.passwordEncrypted)
          : passwordEntry.passwordEncrypted
      };

      console.log('Decrypted password:', decryptedEntry.passwordEncrypted);

      console.log('Password retrieved and decrypted successfully');
      res.status(200).json({ 
        message: 'Password retrieved successfully',
        password: decryptedEntry 
      });
    } catch (decryptError) {
      console.error('Decryption error:', decryptError);
      res.status(500).json({ 
        message: 'Error decrypting password',
        error: decryptError.message 
      });
    }
  } catch (error) {
    console.error('Error fetching password by ID:', error);
    res.status(500).json({ 
      message: 'Error fetching password by ID', 
      error: error.message 
    });
  }
};

export const deletePassword = async (req, res) => {
    const { userId } = req.body;
    const { passwordId } = req.params;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const vault = await Vault.findOne({ userId });
      if (!vault) {
        return res.status(404).json({ message: 'Vault not found' });
      }
  
      const passwordEntry = vault.passwords.id(passwordId);
      if (!passwordEntry) {
        return res.status(404).json({ message: 'Password entry not found' });
      }
  
      vault.passwords.pull({ _id: passwordId });
      await vault.save();
  
      res.status(200).json({ message: 'Password deleted successfully', vault });
    } catch (error) {
        console.error('Error deleting password:', error);
        res.status(500).json({ message: 'Error deleting password', error });
      }
};

export const saveImportedPasswords = async (req, res) => {
  console.log('Import request received:', {
    passwordCount: req.body.passwords?.length,
    userId: req.user.userId
  });

  const { passwords } = req.body;
  const userId = req.user.userId;  // Get userId from authenticated request

  if (!passwords || !Array.isArray(passwords)) {
    console.error('Invalid passwords array');
    return res.status(400).json({ message: 'Valid passwords array is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    let vault = await Vault.findOne({ userId });
    if (!vault) {
      console.log('Creating new vault for user:', userId);
      const encryptionKey = crypto.randomBytes(32).toString('hex');
      vault = new Vault({ 
        userId, 
        passwords: [], 
        encryption_key: encryptionKey 
      });
    }

    console.log('Processing passwords for import');
    const importedPasswords = passwords.map(pass => ({
      site: pass.url,
      username: pass.username,
      passwordEncrypted: pass.password,
      notes: pass.note || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    vault.passwords.push(...importedPasswords);
    await vault.save();

    console.log('Import successful:', {
      userId,
      importedCount: importedPasswords.length
    });

    res.status(200).json({ 
      message: `Successfully imported ${importedPasswords.length} passwords`,
      vault 
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ 
      message: 'Error importing passwords', 
      error: error.message 
    });
  }
};
