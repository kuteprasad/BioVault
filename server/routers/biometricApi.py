from fastapi import APIRouter, HTTPException
from deepface import DeepFace
from pydantic import BaseModel
import os
import json
import numpy as np
import urllib.request
from datetime import datetime
import aiohttp
import asyncio
import subprocess
from pathlib import Path
import logging
import wespeaker
import soundfile as sf
import torchaudio
from pyannote.audio import Pipeline
import torch


router = APIRouter()

class Photo(BaseModel):
    img1_path: str
    img2_path: str

class Voice(BaseModel):
    voice1_path: str
    voice2_path: str

class FaceDetect(BaseModel):
    imageUrl: str

# Initialize WeSpeaker model
try:
    voice_model = wespeaker.load_model('chinese')
    # Set CPU as default device - change to cuda:0 if GPU available
    voice_model.set_device('cpu')
except Exception as e:
    logging.error(f"Failed to load WeSpeaker model: {str(e)}")
    voice_model = None

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


@router.post('/biometric/face-detect')
async def detect_faces(data: FaceDetect):
    try:
        verification = DeepFace.verify(
            img1_path=data.imageUrl,
            img2_path="https://res.cloudinary.com/ddonrwnen/image/upload/v1738813859/biometrics/face/k22q4o8myqgxd6nznojm.jpg",
            model_name="VGG-Face",
            detector_backend="opencv"
        )
        logging.info(f"Verification complete: {verification}")
        
        return {"verified": True}
        
    except Exception as e:
        return {"verified": False}

TEMP_DIR = "temp"

pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization",use_auth_token="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")
pipeline.to(torch.device("cuda"))


@router.post('/biometric/voice')
async def verify_voices(data: Voice):
    original_files = []
    wav_files = []
    combined_path = None
    
    try:
        # Create temp directory
        temp_dir = os.path.abspath(TEMP_DIR)
        os.makedirs(temp_dir, exist_ok=True)
        
        # Create filenames with original extensions from URLs
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Extract extensions from URLs or default to .mp3
        url_pairs = [(data.voice1_path, f'voice1_{timestamp}'), (data.voice2_path, f'voice2_{timestamp}')]
        combined_path = os.path.join(temp_dir, f"combined_{timestamp}.wav")
        silence_path = os.path.join(temp_dir, f"silence_{timestamp}.wav")
        
        # Download files with original extensions
        for idx, (url, base_name) in enumerate(url_pairs):
            # Get extension from URL or default to .mp3
            ext = os.path.splitext(url.split('?')[0])[1]
            if not ext:
                ext = '.mp3'  # Default extension
            
            orig_path = os.path.join(temp_dir, f"{base_name}{ext}")
            wav_path = os.path.join(temp_dir, f"{base_name}.wav")
            
            # Download file
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(url) as resp:
                        with open(orig_path, 'wb') as f:
                            f.write(await resp.read())
                logging.info(f"Downloaded file to {orig_path}")
                original_files.append(orig_path)
                
                # Convert to WAV using FFmpeg
                subprocess.run([
                    'ffmpeg', '-y', '-i', orig_path, 
                    '-acodec', 'pcm_s16le', '-ar', '16000', 
                    '-ac', '1', '-f', 'wav', wav_path
                ], check=True, capture_output=True)
                
                logging.info(f"Converted to WAV: {wav_path}")
                wav_files.append(wav_path)
                
            except Exception as e:
                logging.error(f"Error processing file {url}: {str(e)}")
                raise HTTPException(status_code=400, detail=f"Failed to process audio file: {str(e)}")
        
        # Create a 3-second silence file
        subprocess.run([
            'ffmpeg', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=16000:cl=mono', 
            '-t', '3', '-acodec', 'pcm_s16le', '-ar', '16000', 
            '-ac', '1', silence_path
        ], check=True, capture_output=True)
        
        # Create a file list for concatenation
        file_list_path = os.path.join(temp_dir, f"list_{timestamp}.txt")
        with open(file_list_path, 'w') as f:
            f.write(f"file '{wav_files[0]}'\n")
            f.write(f"file '{silence_path}'\n")
            f.write(f"file '{wav_files[1]}'\n")
        
        # Combine the files
        subprocess.run([
            'ffmpeg', '-y', '-f', 'concat', '-safe', '0', 
            '-i', file_list_path, '-c', 'copy', combined_path
        ], check=True, capture_output=True)
        
        logging.info(f"Combined audio created at: {combined_path}")
        
        try:
            # Load audio with torchaudio
            waveform, sample_rate = torchaudio.load(combined_path)
            logging.info(f"Audio loaded - shape: {waveform.shape}, sample rate: {sample_rate}")
            
            # Perform diarization with pyannote
            diarization = pipeline(
                {"waveform": waveform, "sample_rate": sample_rate},
                min_speakers=1, 
                max_speakers=2
            )
            
            logging.info(f"Diarization type: {type(diarization)}")
            
            # Extract unique speakers from the diarization result
            speakers = set()
            first_speaker = None
            last_speaker = None
            
            # Iterate through the segments and collect speaker information
            for segment, track, speaker in diarization.itertracks(yield_label=True):
                speakers.add(speaker)
                
                # Track the first and last speaker
                if first_speaker is None:
                    first_speaker = speaker
                last_speaker = speaker
                
                logging.info(f"Segment: [{segment.start:.2f} --> {segment.end:.2f}] Speaker: {speaker}")
            
            # Check if there's only one unique speaker
            is_same_speaker = len(speakers) == 1
            
            # Alternative check: first and last segments have the same speaker
            first_last_match = first_speaker == last_speaker if first_speaker and last_speaker else False
            
            logging.info(f"Detected {len(speakers)} unique speakers")
            logging.info(f"First speaker: {first_speaker}, Last speaker: {last_speaker}")
            
            result = {
                "verified": is_same_speaker,
                "speakers_count": len(speakers),
                "first_last_match": first_last_match,
                "details": f"First speaker: {first_speaker}, Last speaker: {last_speaker}"
            }
            
            return result
            
        except Exception as e:
            logging.error(f"Error in diarization: {str(e)}")
            return {"verified": False, "error": str(e)}

    except Exception as e:
        logging.error(f"Voice verification failed: {str(e)}")
        return {"verified": False, "error": str(e)}
            
    finally:
        # Cleanup all files
        cleanup_files = original_files + wav_files + [
            silence_path if 'silence_path' in locals() else None,
            combined_path if 'combined_path' in locals() else None,
            file_list_path if 'file_list_path' in locals() else None
        ]
        
        for path in cleanup_files:
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                    logging.info(f"Cleaned up {path}")
                except Exception as e:
                    logging.error(f"Failed to clean up {path}: {str(e)}")