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
        
        return {"verified": verification["verified"]}
        
    except Exception as e:
        logging.error(f"Verification failed: {str(e)}")
        return {"verified": False}
        
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
    silence_path = None
    combined_path = None
    file_list = None
    
    try:
        # Create temp directory with absolute path
        temp_dir = os.path.abspath(TEMP_DIR)
        os.makedirs(temp_dir, exist_ok=True)
        
        # Generate silence file if it doesn't exist
        silence_path = os.path.join(temp_dir, 'silence.webm')
        if not os.path.exists(silence_path):
            subprocess.run([
                'ffmpeg', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', 
                '-t', '5', '-c:a', 'libopus', silence_path
            ], check=True)

        # Create unique filenames
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        voice1_path = os.path.join(temp_dir, f'voice1_{timestamp}.webm')
        voice2_path = os.path.join(temp_dir, f'voice2_{timestamp}.webm')
        combined_path = os.path.join(temp_dir, f'combined_{timestamp}.webm')
        file_list = os.path.join(temp_dir, f'files_{timestamp}.txt')

        # Download files
        for url, path in [(data.voice1_path, voice1_path), (data.voice2_path, voice2_path)]:
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(url) as resp:
                        with open(path, 'wb') as f:
                            f.write(await resp.read())
                logging.info(f"Downloaded file to {path}")
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Failed to download {url}: {str(e)}")

        # Create file list for ffmpeg with absolute paths
        with open(file_list, 'w') as f:
            f.write(f"file '{os.path.abspath(voice1_path)}'\n")
            f.write(f"file '{os.path.abspath(silence_path)}'\n")
            f.write(f"file '{os.path.abspath(voice2_path)}'\n")

        # Combine files using ffmpeg
        try:
            subprocess.run([
                'ffmpeg', '-f', 'concat', '-safe', '0',
                '-i', file_list,
                '-c', 'copy',
                combined_path
            ], check=True)

            # Process combined file with Deepgram
            response = transcribe_audio(combined_path, API_KEY)
            if response:
                is_same_speaker = verify_speaker(response)
                return {"verified": is_same_speaker}
            else:
                raise HTTPException(status_code=500, detail="Transcription failed")

        except subprocess.CalledProcessError as e:
            raise HTTPException(status_code=400, detail=f"Failed to combine audio files: {str(e)}")
            
    finally:
        # Cleanup files
        for path in [voice1_path, voice2_path, combined_path, file_list]:
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                    logging.info(f"Cleaned up {path}")
                except Exception as e:
                    logging.error(f"Failed to clean up {path}: {str(e)}")



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
            utt_split = 3,
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
            
            # Assign speaker ID 1 if confidence is low
            
            speakers.append(speaker_id)

            

        # Verify all speakers are the same
        return len(set(speakers)) == 1
        
    except Exception as e:
        print(f"Error in speaker verification: {e}")
        return False
