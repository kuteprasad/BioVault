import Vault from '../models/Vault.js';
import User from '../models/User.js';
import crypto from 'crypto';

export const addPassword = async (req, res) => {
  const { userId, site, username, passwordEncrypted, notes } = req.body;

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
  const { userId, site, username, passwordEncrypted, notes } = req.body;
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
    const { userId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const vault = await Vault.findOne({ userId }).populate('userId');
      if (!vault) {
        return res.status(404).json({ message: 'Vault not found' });
      }
  
      res.status(200).json({ vault });
    } catch (error) {
      console.error('Error retriving passwords:', error);
      res.status(500).json({ message: 'Error retrieving vault', error });
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