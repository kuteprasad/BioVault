from pydantic import BaseModel, Field
from bson import ObjectId
from .py_object_id import PyObjectId
from datetime import datetime
from typing import Dict

# main model user data
class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    full_name: str
    email: str
    master_password: str
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}