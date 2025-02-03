from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId
from .py_object_id import PyObjectId
from datetime import datetime

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    full_name: str
    email: str
    master_password: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,              # use the new key name
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
