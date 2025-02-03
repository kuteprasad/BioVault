import motor.motor_asyncio
from bson import ObjectId
import os
from dotenv import load_dotenv
import asyncio

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_URI")

client =  motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
db = client.get_database()

# trying ecample

user_collection = db.get_collection("users")
# vault_collection = db.get_collection("vaults")
# biometric_collection = db.get_collection("biometric_data")
# activity_log_collection = db.get_collection("activity_logs")
# settings_collection = db.get_collection("settings")


# async def check_collection_exists(collection_name: str) -> bool:
#     collections = await db.list_collection_names()
#     return collection_name in collections


# async def insert_user(user_data: dict):
#     result = await user_collection.insert_one(user_data)
#     return str(result.inserted_id)



# async def main():
#     if await check_collection_exists("users"):
#         print("The 'users' collection exists.")
#     else:
#         print("The 'users' collection does not exist.")

#     if await check_collection_exists("vaults"):
#         print("The 'vaults' collection exists.")
#     else:
#         print("The 'vaults' collection does not exist.")
        
        
# # insert connectivity   
#     user_data = {
#         "full_name": "Tejuu Durge",
#         "email": "tejaswini@gmail.com",
#         "master_password": "hashed_password",
#         "created_at": "2023-10-01T00:00:00Z",
#         "updated_at": "2023-10-01T00:00:00Z"
#     }
#     user_id = await insert_user(user_data)
#     print(f"Inserted user with ID: {user_id}")
        
        

# asyncio.run(main())