import mongoose from 'mongoose';

const passwordSchema = new mongoose.Schema({
  site: String,
  username: String,
  passwordEncrypted: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const vaultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  passwords: [passwordSchema],
  encryptionKey: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Vault = mongoose.model('Vault', vaultSchema);
export default Vault;