from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from models.user import User
from database import db
from utils.security import hash_password

router = APIRouter()

@router.post("/register")
# async def register():
#     return {"message": "Auth register 1 endpoint"}
async def register(user: User):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.master_password)

    new_user = {
        "full_name": user.full_name,
        "email": user.email,
        "master_password": hashed_password,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    result = await db.users.insert_one(new_user)
    return {"message": "User registered successfully", "user_id": str(result.inserted_id)}

