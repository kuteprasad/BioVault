import { toast } from 'sonner';
import api from '../utils/api';
import { getToken } from '../utils/authUtils';

// Type definitions
export interface PasswordEntry {
  _id?: string;
  site: string;
  username: string;
  passwordEncrypted: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Match the interface from importPasswords.tsx
export interface ImportedPassword {
  name: string;
  url: string;
  username: string;
  password: string;
  note: string;
}

class PasswordService {
  private baseUrl = '/vault';  

  async getVault(): Promise<PasswordEntry[]> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.get(`${this.baseUrl}/vault`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.passwords || [];
    } catch (error: any) {
      console.error('Error fetching vault:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch passwords');
    }
  }

  async addPassword(password: Omit<PasswordEntry, '_id'>): Promise<PasswordEntry> {
    try {
      const token = getToken();
      const response = await api.post(`${this.baseUrl}/add`, password, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Password added successfully');
      return response.data.password;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error adding password');
      throw error;
    }
  }

  async updatePassword(passwordId: string, password: Partial<PasswordEntry>): Promise<PasswordEntry> {
    try {
      const token = getToken();
      const response = await api.put(`${this.baseUrl}/${passwordId}`, password, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Password updated successfully');
      return response.data.password;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error updating password');
      throw error;
    }
  }

  async deletePassword(passwordId: string): Promise<void> {
    try {
      const token = getToken();
      await api.delete(`${this.baseUrl}/${passwordId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Password deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error deleting password');
      throw error;
    }
  }

  // New method for importing passwords
  async importPasswords(passwords: ImportedPassword[]): Promise<void> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Attempting import with:', {
        endpoint: `${this.baseUrl}/import-passwords`,
        passwordCount: passwords.length
      });

      const response = await api.post(
        `${this.baseUrl}/import-passwords`,
        { passwords },  // Only send passwords, userId will be extracted from token
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Import response:', response.data);
      toast.success(response.data.message || 'Passwords imported successfully');
    } catch (error: any) {
      console.error('Import error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      toast.error(error.response?.data?.message || 'Failed to import passwords');
      throw error;
    }
  }
}

export default new PasswordService();