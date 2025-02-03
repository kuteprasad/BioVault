from bson import ObjectId

# Custom validator for MongoDB ObjectId
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError('Invalid objectid')
        return ObjectId(v)
    
    # Modifies the OpenAPI schema to show ObjectId as a string.
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type='string')