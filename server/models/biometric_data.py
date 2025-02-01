from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime
from typing import Dict

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError('Invalid objectid')
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type='string')

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
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}