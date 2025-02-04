import axios from 'axios';
import { getToken } from './authUtils';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store'; // Adjust the import path as necessary

const API_URL = 'http://localhost:3000/'; // Replace with your backend URL

// const token = useSelector((state: RootState) => state.auth.token);
  
// console.log("token in api: ", token);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        // 'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
});

export default api;