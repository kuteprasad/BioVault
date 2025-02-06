import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  autoFill: Boolean,
  biometricLogin: Boolean,
  twoFAEnabled: Boolean,
  backupEmail: String,
  reVerificationInterval: { type: String, default: '1440m' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

settingsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;