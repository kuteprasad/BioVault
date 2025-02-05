from fastapi import APIRouter


router = APIRouter()


@router.get('/biometric')
def biometric():
    verification = DeepFace.verify(img1_path = "img1.png", img2_path = "sha.png")
    return verification
    