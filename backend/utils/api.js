import axios from 'axios';

export const comparePhotoFastApi = async (storedUrl, preparedUrl) => {
    try {
        const response = await axios.post(`${process.env.FASTAPI_URL}/api/biometric/photo`, {
            img1_path: storedUrl,
            img2_path: preparedUrl
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error comparing photos:', error);
        throw error;
    }
}

export const compareVoiceFastApi = async (storedUrl, preparedUrl) => {
    try {
        console.log(storedUrl)
        const response = await axios.post(`${process.env.FASTAPI_URL}/api/biometric/voice`, {
            voice1_path: storedUrl,
            voice2_path: preparedUrl
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("asdfghj    kjahsdkjah kajdhskajs",response.data)

        return response.data;
    } catch (error) {
        console.error('Error comparing voices:', error);
        throw error;
    }
}

export const compareFingerprintFastApi = async (storedUrl, preparedUrl) => {
    try {
        const response = await axios.post(`${process.env.FASTAPI_URL}/api/biometric/fingerprint`, {
            storedUrl,
            preparedUrl
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error comparing fingerprints:', error);
        throw error;
    }
}