import BiometricData from '../models/BiometricData.js';
import dotenv from 'dotenv';
import cloudinary from '../config/cloudinary.js';
import { calculateMatchPercentage } from '../services/biometricServices.js';

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

const getBiometricData = async (userId, type) => {

    console.log(`Fetching stored ${type} biometric data for user:`, userId);

    const storedData = await BiometricData.findOne({ userId });
    if (!storedData) {
        const error = new Error('No biometric data found for user');
        error.statusCode = 404; 
        throw error;
    }

    console.log("Stored biometric data found:", storedData);
    return storedData;
}

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

        let uploadedData;
        // const myFile = new File([file], 'image.jpeg', {
        //     type: myBlob.type,
        // });
        
        console.log(myFile);
        // logs: File { name: "image.jpeg", lastModified: ..., size: 1024, type: "image/jpeg" }
        // switch (type) {
        //     case 'photo':
        //         uploadedData = await handlePhotoUpload(file);
        //         break;
        //     case 'voice':
        //         uploadedData = await handleVoiceUpload(file);
        //         break;
        //     case 'fingerprint':
        //         uploadedData = await handleFingerprintUpload(file, userId);
        //         break;
        //     default:
        //         return res.status(400).json({ message: 'Invalid biometric type' });
        // }
        // console.log("Uploaded new biometric data:", uploadedData);

        const matchPercentage = await calculateMatchPercentage(storedBiometric, uploadedData, type);
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
