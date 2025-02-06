import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Convert the key to correct length (32 bytes for AES-256)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
const KEY_BUFFER = Buffer.from(ENCRYPTION_KEY).slice(0, 32); // Ensure key is exactly 32 bytes
const IV_LENGTH = 16; // For AES, this is always 16

export const encryptionService = {
  encrypt(text) {
    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv('aes-256-cbc', KEY_BUFFER, iv);
      let encrypted = cipher.update(text);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  },

  decrypt(text) {
    try {
      const textParts = text.split(':');
      const iv = Buffer.from(textParts.shift(), 'hex');
      const encryptedText = Buffer.from(textParts.join(':'), 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', KEY_BUFFER, iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }
}; 