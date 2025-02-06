import { compareFingerprintFastApi, comparePhotoFastApi, compareVoiceFastApi } from '../utils/api.js';


export const compareImages = async (storedUrl, preparedUrl) => {
    try {
        const response = await comparePhotoFastApi(storedUrl, preparedUrl);
        console.log('Face match response:', response);
        return response.verified;
    } catch (error) {
        console.error('Error comparing faces:', error);
        throw error;
    }
};

export const compareVoice = async (storedUrl, uploadedUrl) => {
    try {
       const response = await compareVoiceFastApi(storedUrl, uploadedUrl);
         console.log('Voice match response:', response);
        return response.verified;

    } catch (error) {
        console.error('Error comparing voices:', error);
        throw new Error('Voice comparison failed');
    }
};

export const calculateMatch = async (storedUrl, preparedUrl, type) => {
    console.log(`Calculating match  for ${type}...`);
    try {
        switch (type) {
            case 'photo':
                return await compareImages(storedUrl, preparedUrl);
            case 'voice':
                return await compareVoiceFastApi(storedUrl, preparedUrl);
            case 'fingerprint':
                return await compareFingerprintFastApi(storedUrl, preparedUrl);
            default:
                throw new Error('Invalid biometric type');
        }
    } catch (error) {
        console.error('Error in calculateMatchPercentage:', error);
        throw error;
    }
};

