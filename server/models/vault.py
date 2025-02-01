''' 
Stores encrypted passwords for each user.
'''

from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime
from typing import List, Optional

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
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}