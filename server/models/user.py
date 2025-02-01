from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime
from typing import Dict

# Custom validator for MongoDB ObjectId
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

# Sub-model for biometric authentication data
class BiometricAuth(BaseModel):
    face_id: str
    voice_id: str
    fingerprint_id: str


# later reference two-factor authentication
class TwoFactorAuth(BaseModel):
    enabled: bool
    method: str
    secret_key: str

# main model user data
class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    full_name: str
    email: str
    master_password: str
    biometric_auth: BiometricAuth
    two_factor_auth: TwoFactorAuth
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}