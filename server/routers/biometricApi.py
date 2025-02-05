from fastapi import APIRouter, HTTPException
from deepface import DeepFace
from pydantic import BaseModel
import deepgram
import os
import json
import sounddevice as sd
import scipy.io.wavfile as webm
import numpy as np
import urllib.request
from datetime import datetime
import aiohttp
import asyncio
from deepgram import (
    DeepgramClient,
    PrerecordedOptions,
    FileSource,
)

import subprocess
from pathlib import Path

import logging


router = APIRouter()

class Photo(BaseModel):
    img1_path: str
    img2_path: str

class Voice(BaseModel):
    voice1_path :str
    voice2_path :str


@router.post('/biometric/photo')
async def verify_faces(data: Photo):
    img1_path = None
    img2_path = None
    
    try:
        verification = DeepFace.verify(
            img1_path=data.img1_path,
            img2_path=data.img2_path,
            model_name="VGG-Face",
            detector_backend="opencv"
        )
        logging.info(f"Verification complete: {verification}")
        
        return verification
        
    except Exception as e:
        logging.error(f"Verification failed: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Verification failed: {str(e)}")
        
    finally:
        # Cleanup with logging
        if img1_path:
            success = True

            logging.info(f"Cleanup of image 1 {'successful' if success else 'failed'}")
        if img2_path:
     
            success = True
            logging.info(f"Cleanup of image 2 {'successful' if success else 'failed'}")


TEMP_DIR = "temp"
API_KEY = "a8b75fa07ad77e26a7866d995ed329553927767b"

@router.post('/biometric/voice')
async def verify_voices(data: Voice):
    voice1_path = None
    voice2_path = None
    combined_path = None
    
    try:
        # Create temp directory
        os.makedirs(TEMP_DIR, exist_ok=True)
        
        # Set unique filenames with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        voice1_path = os.path.join(TEMP_DIR, f'voice1_{timestamp}.webm')
        voice2_path = os.path.join(TEMP_DIR, f'voice2_{timestamp}.webm')
        combined_path = os.path.join(TEMP_DIR, f'combined_{timestamp}.webm')

        # Download WebM files directly
        for url, path in [(data.voice1_path, voice1_path), (data.voice2_path, voice2_path)]:
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(url) as resp:
                        with open(path, 'wb') as f:
                            f.write(await resp.read())
                logging.info(f"Downloaded file to {path}")
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Failed to download {url}: {str(e)}")

        # Process with Deepgram directly with WebM file
        try:
            response = transcribe_audio(voice1_path, API_KEY)
            if response:
                is_same_speaker = verify_speaker(response)
                return {"verified": is_same_speaker}
            else:
                raise HTTPException(status_code=500, detail="Transcription failed")
                
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Audio processing failed: {str(e)}")
            
    finally:
        # Cleanup files
        for path in [voice1_path, voice2_path, combined_path]:
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                    logging.info(f"Cleaned up {path}")
                except Exception as e:
                    logging.error(f"Failed to clean up {path}: {str(e)}")

def combine_audio_with_delay(audio1, audio2, sample_rate, delay_seconds=6):
    """Combine two audio samples with delay"""
    delay_samples = int(delay_seconds * sample_rate)
    silence = np.zeros((delay_samples,), dtype=np.int16)
    combined = np.concatenate([audio1.flatten(), silence, audio2.flatten()])
    return combined.reshape(-1, 1)

def save_audio(audio_data, sample_rate, filename):
    """Save audio data to a WAV file"""
    webm.write(filename, sample_rate, audio_data)
    return filename

def transcribe_audio(filepath, api_key):

    try:
        deepgram = DeepgramClient(api_key=api_key)
        
        with open(filepath, 'rb') as file:
            buffer_data = file.read()
        
        payload: FileSource = {
            "buffer": buffer_data,
        }
        
        options = PrerecordedOptions(
            model="nova-2",
            diarize=True,
            utterances=True,
            utt_split = 5,
            # punctuate=True,
        )
        print("Transcribing audio...")
        response = deepgram.listen.rest.v("1").transcribe_file(payload, options)
        return response
            
    except Exception as e:
        print(f"Transcription error: {e}")
        return None
    

def verify_speaker(response):
    """Simple speaker verification check"""
    try:
        utterances = response['results']['utterances']
        if len(utterances) < 2:
            return False

        # Map speakers based on confidence threshold
        speakers = []
        for utterance in utterances:
            speaker_id = utterance['speaker']
            confidence = utterance['speaker_confidence']
            
            # Assign speaker ID 1 if confidence is low
            if confidence < 0.50:
                speaker_id = 1
            speakers.append(speaker_id)

        # Verify all speakers are the same
        return len(set(speakers)) == 1
        
    except Exception as e:
        print(f"Error in speaker verification: {e}")
        return False
