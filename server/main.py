from fastapi import FastAPI, HTTPException
from routes.auth import router as auth_router  # Import the router
from models.user import User
from database import db
from utils.security import hash_password
from datetime import datetime, timezone

app = FastAPI()

# Include the auth router to access the /register endpoint
app.include_router(auth_router, prefix="/auth")

# @app.get("/")
# async def root():
#     return {"message": "Hello World"}

# @app.post("/register")
# # async def register():
# #     return {"message": "Auth register 0 endpoint"}
# async def register(user: User):
#     existing_user = await db.users.find_one({"email": user.email})
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     hashed_password = hash_password(user.master_password)

#     new_user = {
#         "full_name": user.full_name,
#         "email": user.email,
#         "master_password": hashed_password,
#         "created_at": datetime.now(timezone.utc),
#         "updated_at": datetime.now(timezone.utc)
#     }
#     result = await db.users.insert_one(new_user)
#     return {"message": "User registered successfully", "user_id": str(result.inserted_id)}