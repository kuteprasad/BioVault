# Biometric Password Vault

## Overview
Biometric Password Vault is a cross-platform application designed to securely store, manage, and retrieve passwords using advanced biometric authentication methods such as face, voice, and fingerprint recognition. The application aims to simplify password management while ensuring security and synchronization across devices.

## Key Features
- **Integration with Google’s Password Storage**: Seamlessly integrates with existing password management solutions.
- **Cross-Platform Support**: Available as a Chrome Extension, Android App, and Web Interface.
- **Triple-Biometric Security**: Utilizes voice, fingerprint, and photo recognition for enhanced security.
- **Two-Factor Authentication (2FA)**: Adds an extra layer of security during login and transactions.
- **Advanced Encryption Standards**: Employs AES-256 encryption for top-tier security of user data.

## Technical Information
### Frontend
- **Web Application**: Built using React, with components, pages, services, and custom hooks for state management.
- **Mobile Application**: Developed with React Native, featuring components and screens tailored for mobile devices.
- **Chrome Extension**: A dedicated extension for password management directly in the browser.

### Backend
- **FastAPI**: The backend is built using FastAPI for high performance and scalability.
- **Database**: User data is stored in MongoDB, with encrypted vault files and biometric data stored on Cloudinary.
- **Authentication**: Integrates biometrics using WebAuthn and employs AES-256 encryption for data security.

## Setup Instructions
1. **Clone the Repository**: 
   ```bash
   git clone <repository-url>
   cd biometric-password-vault
   ```

2. **Frontend Setup**:
   - Navigate to the `frontend/web` directory and install dependencies:
     ```bash
     cd frontend/web
     npm install
     ```
   - For mobile, navigate to `frontend/mobile` and install dependencies:
     ```bash
     cd frontend/mobile
     npm install
     ```

3. **Backend Setup**:
   - Navigate to the `backend` directory and install dependencies:
     ```bash
     cd backend
     pip install -r requirements.txt
     ```

4. **Environment Variables**: Create a `.env` file in the `backend` directory and configure your environment variables.

5. **Run the Applications**:
   - Start the backend server:
     ```bash
     uvicorn src.main:app --reload
     ```
   - Start the frontend applications as per their respective instructions.

## Contribution
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.