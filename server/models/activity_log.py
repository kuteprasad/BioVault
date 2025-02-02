# Tracks user actions to monitor for suspicious activity and enhance security.
from pydantic import BaseModel, Field
from datetime import datetime
from .py_object_id import PyObjectId
from bson import ObjectId


## Main model for activity logs
class ActivityLog(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    action: str
    status: str
    ip_address: str
    device_info: str
    timestamp: datetime

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}