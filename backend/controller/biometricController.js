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
        cloudinaryId: uploadResult.public_id,
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
        { resource_type: 'raw', folder: 'biometrics/voice' },
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
  
    return {
      voice: {
        cloudinaryId: uploadResult.public_id,
        metadata: {
          format: uploadResult.format
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
    const file = req.file;
    const userId = req.user.userId;
  
    try {
      let updateData;
      
      switch(type) {
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
        throw new Error('No biometric data found for user');
    }
    console.log("Stored biometric data found:", storedData);
    
    if (type === 'photo' && storedData.face?.cloudinaryId) {
        const cloudinaryData = await cloudinary.api.resource(storedData.face.cloudinaryId, {
            resource_type: 'image'
        });
        storedData.face.imageUrl = cloudinaryData.secure_url;
    }
    
    if (type === 'voice' && storedData.voice?.cloudinaryId) {
        const cloudinaryData = await cloudinary.api.resource(storedData.voice.cloudinaryId, {
            resource_type: 'raw'
        });
        storedData.voice.audioUrl = cloudinaryData.secure_url;
    }
    
    return storedData;
};


const matchBiometricData = async (req, res) => {
    const { type } = req.params;
    const file = req.file;
    const userId = req.user.userId;

    console.log("Starting biometric match process for:", type);
    
    try {
        const storedBiometric = await getBiometricData(userId, type);
        console.log("Retrieved stored biometric data:", storedBiometric);

        let uploadedData;
        switch(type) {
            case 'photo':
                uploadedData = await handlePhotoUpload(file);
                break;
            case 'voice':
                uploadedData = await handleVoiceUpload(file);
                break;
            case 'fingerprint':
                uploadedData = await handleFingerprintUpload(file, userId);
                break;
            default:
                return res.status(400).json({ message: 'Invalid biometric type' });
        }
        console.log("Uploaded new biometric data:", uploadedData);

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


// import BiometricData from '../models/BiometricData.js';
// import dotenv from 'dotenv';
// import cloudinary from '../config/cloudinary.js';

// dotenv.config();

// const handlePhotoUpload = async (file) => {
//     const uploadResult = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         { resource_type: 'image', folder: 'biometrics/face' },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       ).end(file.buffer);
//     });
  
//     return {
//       face: {
//         cloudinaryId: uploadResult.public_id,
//         metadata: {
//           resolution: `${uploadResult.width}x${uploadResult.height}`,
//           format: uploadResult.format
//         }
//       }
//     };
//   };
  
//   const handleVoiceUpload = async (file) => {
//     const uploadResult = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         { resource_type: 'raw', folder: 'biometrics/voice' },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       ).end(file.buffer);
//     });
  
//     return {
//       voice: {
//         cloudinaryId: uploadResult.public_id,
//         metadata: {
//           length: `${uploadResult.duration}s`,
//           format: uploadResult.format
//         }
//       }
//     };
//   };
  
//   const handleFingerprintUpload = async (file, userId) => {
//     return {
//       fingerprint: {
//         webauthnId: `webauthn_${userId}`,
//         publicKey: file.buffer.toString('base64')
//       }
//     };
//   };
  
//   const saveBiometricData = async (req, res) => {
//     const { type } = req.params;
//     const file = req.file;
//     const userId = req.user.userId;
  
//     try {
//       let updateData;
      
//       switch(type) {
//         case 'photo':
//           updateData = await handlePhotoUpload(file);
//           break;
//         case 'voice':
//           updateData = await handleVoiceUpload(file);
//           break;
//         case 'fingerprint':
//           updateData = await handleFingerprintUpload(file, userId);
//           break;
//         default:
//           return res.status(400).json({ message: 'Invalid biometric type' });
//       }
  
//       const biometricData = await BiometricData.findOneAndUpdate(
//         { userId },
//         { $set: updateData },
//         { upsert: true, new: true }
//       );
  
//       console.log("Updated biometric data:", biometricData);
//       res.status(200).json({ message: 'Biometric data saved successfully' });
      
//     } catch (error) {
//       console.error('Error in saveBiometricData:', error);
//       res.status(500).json({ message: 'Error saving biometric data', error: error.message });
//     }
//   };
  
//   const calculateMatchPercentage = async (storedData, uploadedData, type) => {
//     // Placeholder for actual biometric comparison logic
//     switch(type) {
//       case 'photo':
//         // Use face recognition API or ML model
//         return 85; // Dummy value for now
//       case 'voice':
//         // Use voice pattern matching
//         return 90; // Dummy value for now
//       case 'fingerprint':
//         // Compare fingerprint patterns
//         return 95; // Dummy value for now
//       default:
//         return 0;
//     }
//   };
  
//   // Helper functions for retrieving biometric data
//   const retrievePhotoData = async (storedData) => {
//     if (!storedData.face?.cloudinaryId) {
//       throw new Error('No face scan data found');
//     }
    
//     const cloudinaryData = await cloudinary.api.resource(storedData.face.cloudinaryId, {
//       resource_type: 'image',
//       type: 'upload'
//     });
  
//     return {
//       face: {
//         ...storedData.face,
//         imageUrl: cloudinaryData.secure_url,
//         rawData: cloudinaryData
//       }
//     };
//   };
  
//   const retrieveVoiceData = async (storedData) => {
//     if (!storedData.voice?.cloudinaryId) {
//       throw new Error('No voice scan data found');
//     }
  
//     const cloudinaryData = await cloudinary.api.resource(storedData.voice.cloudinaryId, {
//       resource_type: 'raw',
//       type: 'upload'
//     });
  
//     return {
//       voice: {
//         ...storedData.voice,
//         audioUrl: cloudinaryData.secure_url,
//         rawData: cloudinaryData
//       }
//     };
//   };
  
//   const retrieveFingerprintData = (storedData) => {
//     if (!storedData.fingerprint?.webauthnId) {
//       throw new Error('No fingerprint data found');
//     }
  
//     return {
//       fingerprint: {
//         ...storedData.fingerprint
//       }
//     };
//   };
  
//   const getBiometricData = async (userId, type) => {
//     try {
//       // Get stored data from MongoDB
//       const storedData = await BiometricData.findOne({ userId });
//       if (!storedData) {
//         throw new Error('No biometric data found for user');
//       }
  
//       // Retrieve based on type
//       switch(type) {
//         case 'photo':
//           return await retrievePhotoData(storedData);
//         case 'voice':
//           return await retrieveVoiceData(storedData);
//         case 'fingerprint':
//           return retrieveFingerprintData(storedData);
//         default:
//           throw new Error('Invalid biometric type');
//       }
//     } catch (error) {
//       throw new Error(`Error retrieving ${type} data: ${error.message}`);
//     }
//   };
  
//   // Update matchBiometricData to use the new retrieval function
//   const matchBiometricData = async (req, res) => {
//     const { type } = req.params;
//     const file = req.file;
//     const userId = req.user.userId;
  
//     console.log("type in matchBiometricData:", type);
  
//     try {
//       // Get stored biometric data
//       const storedBiometric = await getBiometricData(userId, type);
//       console.log("storedBiometric in matchBiometricData:", storedBiometric);
      
//       // Upload and process new biometric data
//       let uploadedData;
//       switch(type) {
//         case 'photo':
//           uploadedData = await handlePhotoUpload(file);
//           break;
//         case 'voice':
//           uploadedData = await handleVoiceUpload(file);
//           break;
//         case 'fingerprint':
//           uploadedData = await handleFingerprintUpload(file, userId);
//           break;
//         default:
//           return res.status(400).json({ message: 'Invalid biometric type' });
//       }
  
//       // Compare and return match percentage
//       const matchResult = await calculateMatchPercentage(storedBiometric, uploadedData, type);
      
//       console.log("matchResult in matchBiometricData:", matchResult);
  
//       res.status(200).json({
//         matchPercentage: matchResult.percentage,
//         matched: matchResult.percentage >= 80
//       });
  
//     } catch (error) {
//       console.error('Error in matchBiometricData:', error);
//       res.status(500).json({ 
//         message: 'Error matching biometric data',
//         error: error.message 
//       });
//     }
//   };
  
//   export { 
//     saveBiometricData, 
//     matchBiometricData 
//   };
