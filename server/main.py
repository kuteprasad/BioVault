from fastapi import FastAPI
from deepface import DeepFace
from routers.biometricApi import router as biometric_router

app = FastAPI()

app.include_router(biometric_router, prefix='/api')

@app.get("/")
def index():
    return {"message": "Hello World"}

