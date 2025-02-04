import mongoose from 'mongoose';

const biometricDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  face: {
    cloudinaryId: String,
    metadata: {
      resolution: String,
      format: String
    }
  },
  voice: {
    cloudinaryId: String,
    metadata: {
      length: String,
      format: String
    }
  },
  fingerprint: {
    webauthnId: String,
    publicKey: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const BiometricData = mongoose.model('BiometricData', biometricDataSchema);
export default BiometricData;