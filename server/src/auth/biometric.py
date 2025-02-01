from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import webauthn

router = APIRouter()

class BiometricData(BaseModel):
    user_id: str
    biometric_type: str  # e.g., 'fingerprint', 'face', 'voice'
    biometric_value: str  # Base64 encoded biometric data

@router.post("/biometric/authenticate")
async def authenticate_biometric(data: BiometricData):
    try:
        # Logic to handle biometric authentication
        # This is a placeholder for actual biometric verification logic
        verified = webauthn.verify_biometric(data.user_id, data.biometric_type, data.biometric_value)
        
        if not verified:
            raise HTTPException(status_code=401, detail="Biometric authentication failed")
        
        return {"message": "Authentication successful"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))