import crypto from 'crypto';

// Simple Hamming distance function
const hammingDistance = (str1, str2) => {
    if (str1.length !== str2.length) return 0; // Avoid incorrect comparisons
    let distance = 0;
    for (let i = 0; i < str1.length; i++) {
        if (str1[i] !== str2[i]) {
            distance++;
        }
    }
    return ((str1.length - distance) / str1.length) * 100; // Convert to percentage
};

// Fingerprint comparison function
export const compareFingerprints = (storedFingerprint, uploadedFingerprint) => {
    if (!storedFingerprint || !uploadedFingerprint) return 0;

    try {
        // Decode base64 fingerprints
        const storedDecoded = Buffer.from(storedFingerprint, 'base64').toString('utf-8');
        const uploadedDecoded = Buffer.from(uploadedFingerprint, 'base64').toString('utf-8');

        // Simple hashing approach
        const storedHash = crypto.createHash('sha256').update(storedDecoded).digest('hex');
        const uploadedHash = crypto.createHash('sha256').update(uploadedDecoded).digest('hex');

        // Calculate similarity using Hamming distance
        return hammingDistance(storedHash, uploadedHash);
        
    } catch (error) {
        console.error("Error comparing fingerprints:", error);
        return 0;
    }
};
