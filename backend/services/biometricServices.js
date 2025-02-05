
import * as faceapi from 'face-api.js';
import { compareFingerprints } from '../utils/fingerprintMatcher.js';
import { voiceBiometricService } from './VoiceBiometricService.js';
import FaceModelLoader from './loadModels.js';
import dotenv from 'dotenv';


dotenv.config();

export const initializeBiometricServices = async () => {
    try {
        await FaceModelLoader.getInstance();
        console.log('Biometric services initialized');
    } catch (error) {
        console.error('Failed to initialize biometric services:', error);
        throw error;
    }
};

export const compareImages = async (storedImage, uploadedImage) => {
    try {
        // Ensure models are loaded
        initializeBiometricServices();
        // await FaceModelLoader.getInstance();

        // Detect faces and compute descriptors
        const storedFace = await faceapi
            .detectSingleFace(storedImage)
            .withFaceLandmarks()
            .withFaceDescriptor();

        const uploadedFace = await faceapi
            .detectSingleFace(uploadedImage)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!storedFace || !uploadedFace) {
            throw new Error('Face not detected in one or both images');
        }

        // Compare face descriptors
        const distance = faceapi.euclideanDistance(
            storedFace.descriptor,
            uploadedFace.descriptor
        );

        // Convert distance to similarity percentage (0.6 is a typical threshold)
        const similarity = Math.max(0, 100 * (1 - distance / 0.6));
        return Math.min(100, similarity);
    } catch (error) {
        console.error('Error comparing faces:', error);
        throw error;
    }
};

export const compareVoice = async (storedUrl, uploadedUrl) => {
    try {
        const matchPercentage = await voiceBiometricService.compareVoices(storedUrl, uploadedUrl);
        console.log('Voice match percentage:', matchPercentage);

        return {
            percentage: matchPercentage,
            matched: matchPercentage >= 80
        };
    } catch (error) {
        console.error('Error comparing voices:', error);
        throw new Error('Voice comparison failed');
    }
};

export const calculateMatchPercentage = async (storedData, preparedData, type) => {
    console.log(`Calculating match percentage for ${type}...`);
    try {
        switch (type) {
            case 'photo':
                return await compareImages(storedData, preparedData);
            case 'voice':
                return await voiceBiometricService.compareVoices(storedData, preparedData);
            case 'fingerprint':
                return await compareFingerprints(storedData, preparedData);
            default:
                throw new Error('Invalid biometric type');
        }
    } catch (error) {
        console.error('Error in calculateMatchPercentage:', error);
        throw error;
    }
};