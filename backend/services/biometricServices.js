import { compareFingerprints } from '../utils/fingerprintMatcher.js'; // Placeholder for actual fingerprint comparison logic
import dotenv from 'dotenv';

dotenv.config();

const getCloudinaryUrl = (cloudinaryId) => {
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${cloudinaryId}`;
};

export const calculateMatchPercentage = async (storedData, uploadedData, type) => {
    console.log(`Calculating match percentage for ${type}...`);

    let storedUrl, uploadedUrl;

    try {
        switch (type) {
            case 'photo':
                storedUrl = getCloudinaryUrl(storedData.face.cloudinaryId);
                uploadedUrl = getCloudinaryUrl(uploadedData.face.cloudinaryId);
                break;

            case 'voice':
                storedUrl = getCloudinaryUrl(storedData.voice.cloudinaryId);
                uploadedUrl = getCloudinaryUrl(uploadedData.voice.cloudinaryId);
                break;

            case 'fingerprint':
                console.log("Comparing fingerprint data...");
                return compareFingerprints(storedData.fingerprint.publicKey, uploadedData.fingerprint.publicKey);

            default:
                return 0;
        }

        console.log(`Stored URL: ${storedUrl}`);
        console.log(`Uploaded URL: ${uploadedUrl}`);

        // Placeholder: Replace with actual biometric matching logic (ML model, API, etc.)
        return 85; // Mock similarity score

    } catch (error) {
        console.error('Error fetching biometric data:', error);
        return 0;
    }
};


