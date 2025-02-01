class User:
    def __init__(self, username: str, password: str, email: str):
        self.username = username
        self.password = password
        self.email = email

    def save(self):
        # Logic to save the user to the database
        pass

    def verify_password(self, password: str) -> bool:
        # Logic to verify the user's password
        return self.password == password

    @classmethod
    def find_by_username(cls, username: str):
        # Logic to find a user by username in the database
        pass

    @classmethod
    def find_by_email(cls, email: str):
        # Logic to find a user by email in the database
        pass