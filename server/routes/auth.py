from fastapi import APIRouter, HTTPException, Depends
from models.user import User  # Import the User schema from models
from utils.security import get_password_hash, create_access_token, get_current_user
from datetime import datetime, timezone
from database import db
from bson import ObjectId as PyObjectId  

router = APIRouter()

@router.post("/register")
async def register(user: User):
    # Hash the master password
    hashed_password = get_password_hash(user.master_password)
    
    # Create a new user instance with all required fields
    new_user = User(
        id=PyObjectId(),
        full_name=user.full_name,
        email=user.email,
        master_password=hashed_password,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    
    # Save the new user to the database
    await db["users"].insert_one(new_user.dict(by_alias=True))
    
    return {"msg": "User registered successfully", "user": new_user}

@router.post("/login")
async def login(user: User):
    # Verify user credentials and generate JWT token
    return {"access_token": "token", "token_type": "bearer"}

@router.get("/me", dependencies=[Depends(get_current_user)])
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user