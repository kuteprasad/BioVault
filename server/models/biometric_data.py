from pydantic import BaseModel, Field
from .py_object_id import PyObjectId
from bson import ObjectId
from datetime import datetime
from typing import Dict

# for face data
class FaceScan(BaseModel):
    cloudinary_id: str
    metadata: Dict[str, str]

# for voice data + meta data this can be further used for vide -> audio feature.
class VoiceScan(BaseModel):
    cloudinary_id: str
    metadata: Dict[str, str]

# fingerprint scanned data
class FingerprintScan(BaseModel):
    webauthn_id: str
    public_key: str

# main biometric data
class BiometricData(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    face_scan: FaceScan
    voice_scan: VoiceScan
    fingerprint_scan: FingerprintScan
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}