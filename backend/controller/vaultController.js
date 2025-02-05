import Vault from '../models/Vault.js';
import User from '../models/User.js';
import crypto from 'crypto';

export const addPassword = async (req, res) => {
  const userId = req.user.userId;
    console.log('Adding password for user:', userId);
  const { site, username, passwordEncrypted, notes } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let vault = await Vault.findOne({ userId });
    if (!vault) {
      const encryptionKey = crypto.randomBytes(32).toString('hex');
      vault = new Vault({ 
        userId, 
        passwords: [], 
        encryption_key: encryptionKey 
      });
    }

    const newPassword = {
      site,
      username,
      passwordEncrypted,
      notes,
    };

    vault.passwords.push(newPassword);
    await vault.save();

    res.status(201).json({ message: 'Password added successfully', vault });
  } catch (error) {
    console.error('Error adding password:', error);
    res.status(500).json({ message: 'Error adding password', error });
  }
};

export const updatePassword = async (req, res) => {
  const userId = req.user.userId;
  console.log('Updating password for user:', userId);
  const { site, username, passwordEncrypted, notes } = req.body;
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

    passwordEntry.site = site || passwordEntry.site;
    passwordEntry.username = username || passwordEntry.username;
    passwordEntry.passwordEncrypted = passwordEncrypted || passwordEntry.passwordEncrypted;
    passwordEntry.notes = notes || passwordEntry.notes;
    passwordEntry.updatedAt = Date.now();

    await vault.save();

    res.status(200).json({ message: 'Password updated successfully', vault });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password', error });
  }
};

export const getVault = async (req, res) => {
  try {
    // Get userId from auth middleware instead of body
    const userId = req.user.userId;
    console.log('Fetching vault for user:', userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const vault = await Vault.findOne({ userId });
    if (!vault) {
      console.log('No vault found, creating new vault');
      // Create new vault if none exists
      const encryptionKey = crypto.randomBytes(32).toString('hex');
      const newVault = new Vault({ 
        userId, 
        passwords: [], 
        encryption_key: encryptionKey 
      });
      await newVault.save();
      return res.status(200).json({ vault: newVault });
    }

    console.log('Vault found with', vault.passwords.length, 'passwords');
    res.status(200).json({ vault });
  } catch (error) {
    console.error('Error retrieving vault:', error);
    res.status(500).json({ message: 'Error retrieving vault', error: error.message });
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
    userId: req.user.userId  // This comes from authMiddleware
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
