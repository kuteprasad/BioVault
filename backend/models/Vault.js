import mongoose from 'mongoose';

const { Schema } = mongoose;

const passwordSchema = new Schema({
  site: { type: String, required: true },
  username: { type: String, required: true },
  passwordEncrypted: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const vaultSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  passwords: [passwordSchema],
  encryption_key: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

vaultSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Vault = mongoose.model('Vault', vaultSchema);

export default Vault;