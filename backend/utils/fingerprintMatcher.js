import {Jimp} from 'jimp';
import pixelmatch from 'pixelmatch';

export const compareFingerprints = async (storedFingerprint, uploadedFingerprint) => {
  try {
    // Read both fingerprint buffers as images
    const stored = await Jimp.read(Buffer.from(storedFingerprint));
    const uploaded = await Jimp.read(Buffer.from(uploadedFingerprint));

    // Ensure same dimensions
    const width = stored.getWidth();
    const height = stored.getHeight();
    uploaded.resize(width, height);

    // Get raw pixel data
    const storedData = stored.bitmap.data;
    const uploadedData = uploaded.bitmap.data;

    // Compare images and get number of different pixels
    const diffPixels = pixelmatch(
      storedData,
      uploadedData,
      null,
      width,
      height,
      { threshold: 0.1 }
    );

    // Calculate and return match percentage
    const totalPixels = width * height;
    const matchPercentage = 100 - ((diffPixels / totalPixels) * 100);
    
    return Math.min(100, Math.max(0, matchPercentage));

  } catch (error) {
    console.error('Fingerprint matching error:', error);
    throw new Error('Fingerprint comparison failed');
  }
};