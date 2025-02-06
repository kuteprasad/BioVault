// services/userService.ts
import api from '../utils/api';
import { getToken } from '../utils/authUtils';

export const updateUserProfile = async (data: { reVerificationInterval: string }) => {
    const token = getToken();
  const response = await api.put('/user/profile', data, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchUserProfile = async () => {
    const token = getToken();
  const response = await api.get('/user/profile', {
    headers: {
        Authorization: `Bearer ${token}`,
    },
  });
  return response.data.settings;
};