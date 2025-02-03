''' Stores encrypted passwords for each user.'''
from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime
from .py_object_id import PyObjectId
from typing import List, Optional


# Sub-model for individual password entries
class Password(BaseModel):
    site: str
    username: str
    password_encrypted: str
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

# Main model for vault data
class Vault(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    vault_name: str
    passwords: List[Password]
    encryption_key: str
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}