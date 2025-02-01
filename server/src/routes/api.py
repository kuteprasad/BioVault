from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class User(BaseModel):
    username: str
    password: str

class PasswordEntry(BaseModel):
    site: str
    username: str
    password: str

passwords_db = []

@router.post("/register", response_model=User)
async def register_user(user: User):
    # Logic to register a new user
    return user

@router.post("/login")
async def login_user(user: User):
    # Logic to authenticate user
    if user.username and user.password:
        return {"message": "Login successful"}
    raise HTTPException(status_code=400, detail="Invalid credentials")

@router.post("/passwords", response_model=PasswordEntry)
async def add_password(entry: PasswordEntry):
    passwords_db.append(entry)
    return entry

@router.get("/passwords", response_model=List[PasswordEntry])
async def get_passwords():
    return passwords_db

@router.delete("/passwords/{site}")
async def delete_password(site: str):
    global passwords_db
    passwords_db = [entry for entry in passwords_db if entry.site != site]
    return {"message": "Password entry deleted"}