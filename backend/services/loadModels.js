import path from 'path';
import { fileURLToPath } from 'url';
import * as faceapi from 'face-api.js';
import { Canvas, Image } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsPath = path.join(__dirname, '../models/face-api');

// Configure face-api to use canvas
faceapi.env.monkeyPatch({ Canvas, Image });

class FaceModelLoader {
    static instance = null;
    static modelsLoaded = false;
    
    static async getInstance() {
        if (!this.instance) {
            this.instance = new FaceModelLoader();
            await this.instance.initialize();
        }
        return this.instance;
    }

    async initialize() {
        if (FaceModelLoader.modelsLoaded) {
            return;
        }

        try {
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath),
                faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath),
                faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath)
            ]);
            FaceModelLoader.modelsLoaded = true;
            console.log('Face-API models loaded successfully');
        } catch (error) {
            console.error('Error loading face-api models:', error);
            throw error;
        }
    }
}

export default FaceModelLoader;