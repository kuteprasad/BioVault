import axios from 'axios';
import faceapi from 'face-api.js';
import { compareFingerprints } from '../utils/fingerprintMatcher.js';
import dotenv from 'dotenv';
import { voiceBiometricService } from './VoiceBiometricService.js';
import cloudinary from '../config/cloudinary.js';

dotenv.config();


const fetchImageData = async (url) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
};

const compareImages = async (storedImage, uploadedImage) => {
    try {
        
        // Load face detection models
        await faceapi.nets.ssdMobilenetv1.loadFromDisk('path/to/models');
        await faceapi.nets.faceLandmark68Net.loadFromDisk('path/to/models');
        await faceapi.nets.faceRecognitionNet.loadFromDisk('path/to/models');

        // Detect faces and compute descriptors
        const storedFace = await faceapi.detectSingleFace(storedImage)
            .withFaceLandmarks()
            .withFaceDescriptor();

        const uploadedFace = await faceapi.detectSingleFace(uploadedImage)
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
        return Math.max(0, Math.min(100, (1 - distance / 0.6) * 100));
    } catch (error) {
        console.error('Error comparing face images:', error);
        throw error;
    }
};

const compareVoice = async (storedUrl, uploadedUrl) => {
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
            case 'photo': {
                return await compareImages(storedData, preparedData);
            }

            case 'voice': {

                return await compareVoice(storedData, preparedData);
            }

            case 'fingerprint': {
                return await compareFingerprints(storedData, preparedData);
            }

            default:
                throw new Error(`Unsupported biometric type: ${type}`);
        }
    } catch (error) {
        console.error('Error in calculateMatchPercentage:', error);
        throw error;
    }
};