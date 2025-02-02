from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# db connection
MONGO_URI=""



@app.get("/")
async def root():
    return {"message": "Hello World"}