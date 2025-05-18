from fastapi import FastAPI
from routers.biometricApi import router as biometric_router
app = FastAPI()

app.include_router(biometric_router, prefix='/api')

@app.get("/")
def index():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)