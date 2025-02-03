'''Stores user preferences, including auto-fill settings.'''
from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime
from .py_object_id import PyObjectId

# Main model for user settings
class Settings(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    auto_fill: bool
    biometric_login: bool
    two_fa_enabled: bool
    backup_email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}