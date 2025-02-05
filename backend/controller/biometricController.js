import BiometricData from '../models/BiometricData.js';
import dotenv from 'dotenv';
import cloudinary from '../config/cloudinary.js';
import { calculateMatchPercentage } from '../services/biometricServices.js';
import axios from 'axios';
import { createCanvas, Image, loadImage } from 'canvas';
import * as faceapi from 'face-api.js';

dotenv.config();



const handlePhotoUpload = async (file) => {
    console.log("Uploading photo to Cloudinary...");
    const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: 'image', folder: 'biometrics/face' },
            (error, result) => {
                if (error) {
                    console.error("Error uploading photo:", error);
                    reject(error);
                } else {
                    console.log("Photo uploaded successfully:", result);
                    resolve(result);
                }
            }
        ).end(file.buffer);
    });

    return {
        face: {
            cloudinaryUrl: uploadResult.secure_url,
            metadata: {
                resolution: `${uploadResult.width}x${uploadResult.height}`,
                format: uploadResult.format
            }
        }
    };
};

const handleVoiceUpload = async (file) => {
    console.log("Uploading voice to Cloudinary...");

    const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: 'video', folder: 'biometrics/voice' },
            (error, result) => {
                if (error) {
                    console.error("Error uploading voice:", error);
                    reject(error);
                } else {
                    console.log("Voice uploaded successfully:", result);
                    resolve(result);
                }
            }
        ).end(file.buffer);
    });

    console.log("Voice upload result:", uploadResult);

    return {
        voice: {
            cloudinaryUrl: uploadResult.secure_url,
            metadata: {
                format: uploadResult.format,
                duration: uploadResult.duration
            }
        }
    };
};

const handleFingerprintUpload = async (file, userId) => {
    console.log("Processing fingerprint data...");
    return {
        fingerprint: {
            webauthnId: `webauthn_${userId}`,
            publicKey: file.buffer.toString('base64')
        }
    };
};

const saveBiometricData = async (req, res) => {
    const { type } = req.params;
    console.log("Saving biometric data for:", type);

    const userId = req.user.userId;
    console.log("User ID:", userId);

    const file = req.file;
    console.log("File:", file);

    try {
        let updateData;

        switch (type) {
            case 'photo':
                updateData = await handlePhotoUpload(file);
                break;
            case 'voice':
                updateData = await handleVoiceUpload(file);
                break;
            case 'fingerprint':
                updateData = await handleFingerprintUpload(file, userId);
                break;
            default:
                return res.status(400).json({ message: 'Invalid biometric type' });
        }

        const biometricData = await BiometricData.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { upsert: true, new: true }
        );

        console.log("Updated biometric data:", biometricData);
        res.status(200).json({ message: 'Biometric data saved successfully' });

    } catch (error) {
        console.error('Error in saveBiometricData:', error);
        res.status(500).json({ message: 'Error saving biometric data', error: error.message });
    }
};



const convertToImage = async (data, isUrl = false) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onerror = reject;
        img.onload = () => resolve(img);
        
        if (isUrl) {
            img.src = data;
        } else {
            // Convert buffer to base64
            const base64 = Buffer.from(data).toString('base64');
            img.src = `data:image/jpeg;base64,${base64}`;
        }
    });
};

const getBiometricData = async (userId, type) => {

    console.log(`Fetching stored ${type} biometric data for user:`, userId);

    const storedData = await BiometricData.findOne({ userId });
    if (!storedData) {
        const error = new Error('No biometric data found for user');
        error.statusCode = 404;
        throw error;
    }

    console.log("Stored biometric data found:", storedData);
    return storedData[type === 'photo' ? 'face' : type];
}

const createCanvasFromImage = async (imageData, isUrl = false) => {
    try {
        const img = await loadImage(isUrl ? imageData : `data:image/jpeg;base64,${imageData.toString('base64')}`);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return canvas;
    } catch (error) {
        console.error('Error creating canvas:', error);
        throw new Error('Failed to create canvas from image');
    }
};

const convertUrlToFile = async (url, type) => {
    if (type === 'photo') {
        return await createCanvasFromImage(url, true);
    }
    try {

        if (type === 'photo') {
            const image = await convertToImage(url, true);
            return {
                image,
                type: 'image/jpeg',
                name: 'stored.jpg'
            };
        }

        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);

        return {
            buffer,
            type:  'audio/webm',
            name:  'stored.webm'
        };

    } catch (error) {
        console.error('Error converting URL to file:', error);
        throw new Error(`Failed to convert ${type} URL to file`);
    }
};

const prepareFileForMatching = async (file, type) => {
    if (type === 'photo') {
        return await createCanvasFromImage(file.buffer);
    }
    switch (type) {
        case 'photo':
            const image = await convertToImage(file.buffer);
            return {
                image,
                type: 'image/jpeg',
                name: 'photo.jpg'
            };
        case 'voice':
            return {
                buffer: file.buffer,
                type: 'audio/webm',
                name: 'voice.webm'
            };

        default:
            throw new Error('Invalid biometric type');
    }
};

const convertPublicKeyToBuffer = (publicKey) => {
    try {
        // Convert base64 string to buffer
        return Buffer.from(publicKey, 'base64');
    } catch (error) {
        console.error('Error converting public key to buffer:', error);
        throw new Error('Failed to convert public key');
    }
};

const matchBiometricData = async (req, res) => {
    const { type } = req.params;
    console.log("Starting biometric match process for:", type);

    const userId = req.user.userId;
    console.log("User ID:", userId);

    const file = req.file;
    console.log("File:", file);

    try {

        const storedBiometric = await getBiometricData(userId, type);
        console.log("Retrieved stored biometric data:", storedBiometric);

        let matchPercentage;

        if (type !== 'fingerprint') {
            const storedFile = await convertUrlToFile(storedBiometric.cloudinaryUrl, type);
            // console.log("Converted stored URL to file:", storedFile);

            // Prepare file for matching
            const preparedFile = await prepareFileForMatching(file, type);
            // console.log("Prepared file for matching:", preparedFile);

            matchPercentage = await calculateMatchPercentage(storedFile, preparedFile, type);

        } else {
            // Compare fingerprint data
            const storedBuffer = convertPublicKeyToBuffer(storedBiometric.publicKey);

            matchPercentage = await calculateMatchPercentage(storedBuffer, file.buffer, type);
        }

        console.log("Calculated match percentage:", matchPercentage);

        res.status(200).json({
            matchPercentage,
            matched: matchPercentage >= 80
        });

    } catch (error) {
        console.error('Error in matchBiometricData:', error);
        res.status(500).json({
            message: 'Error matching biometric data',
            error: error.message
        });
    }
};

export { saveBiometricData, matchBiometricData };
