import sys
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from routes import auth, vault, biometric, activity_log, settings

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Welcome to the API"}

app.include_router(auth.router, prefix="/auth", tags=["auth"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)