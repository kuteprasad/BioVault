import { getExtensionToken } from '../context/AuthContext';

interface VaultResponse {
  vault: {
    userId: string;
    passwords: Array<{
      site: string;
      username: string;
      passwordEncrypted: string;
      notes?: string;
      createdAt: string;
      updatedAt: string;
    }>;
    encryption_key: string;
  };
}

export const getVault = async (): Promise<VaultResponse> => {
  try {
    // Get token from extension storage
    const token = await getExtensionToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Fetching vault with token:', token);

    const response = await fetch('http://localhost:3000/vault/get-vault', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Vault data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching vault:', error);
    throw error;
  }
};