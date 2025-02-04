import * as tf from '@tensorflow/tfjs-node';
import { Readable } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
import meyda from 'meyda';
import axios from 'axios';

const SAMPLE_RATE = 16000;
const FRAME_LENGTH = 1024;
const HOP_LENGTH = 512;
const MEL_BINS = 80;
const FEATURE_LENGTH = 1024;

class VoiceBiometricService {
  constructor() {
    this.model = null;
    this.meyda = meyda;
  }

  async loadModel() {
    if (!this.model) {
      try {
        // Load local model or use a cloud-based alternative
        this.model = await tf.loadLayersModel('file://./models/vggvox/model.json');
      } catch (error) {
        console.error('Error loading model:', error);
        throw new Error('Failed to load voice biometric model');
      }
    }
    return this.model;
  }

  async preprocessAudio(audioBuffer) {
    try {
      // Convert audio to 16kHz mono
      const audio = await this.convertAudio(audioBuffer);
      
      // Extract MFCC features using meyda
      const features = this.meyda.extract(['mfcc'], audio, {
        sampleRate: SAMPLE_RATE,
        bufferSize: FRAME_LENGTH,
        hopSize: HOP_LENGTH,
        melBands: MEL_BINS
      });

      return tf.tensor(features).expandDims(0);
    } catch (error) {
      console.error('Error preprocessing audio:', error);
      throw new Error('Failed to preprocess audio');
    }
  }

  async convertAudio(buffer) {
    return new Promise((resolve, reject) => {
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      ffmpeg(stream)
        .toFormat('wav')
        .audioChannels(1)
        .audioFrequency(SAMPLE_RATE)
        .on('end', () => {
          resolve(buffer);
        })
        .on('error', reject);
    });
  }

  async compareVoices(storedUrl, uploadedUrl) {
    try {
      // Download audio files
      const [storedBuffer, uploadedBuffer] = await Promise.all([
        this.downloadAudio(storedUrl),
        this.downloadAudio(uploadedUrl)
      ]);

      // Simple feature comparison (placeholder for actual voice comparison)
      const storedFeatures = await this.preprocessAudio(storedBuffer);
      const uploadedFeatures = await this.preprocessAudio(uploadedBuffer);

      // Calculate basic similarity (simplified for example)
      const similarity = tf.metrics.cosineProximity(
        storedFeatures, 
        uploadedFeatures
      ).arraySync();

      // Convert to percentage (0-100)
      const matchPercentage = Math.max(0, Math.min(100, (1 - similarity) * 100));
      
      return matchPercentage;
    } catch (error) {
      console.error('Error comparing voices:', error);
      throw new Error('Voice comparison failed');
    }
  }

  async downloadAudio(url) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error downloading audio:', error);
      throw new Error('Failed to download audio');
    }
  }
}

export const voiceBiometricService = new VoiceBiometricService();