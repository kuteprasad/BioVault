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

class PasswordService {
  private baseUrl = '/api/passwords'; // Match your backend route

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
}

export default new PasswordService();