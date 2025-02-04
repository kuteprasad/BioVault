import { toast } from 'sonner';
import api from '../utils/api';

// Type definitions
export interface PasswordEntry {
  id?: string;
  site: string;
  username: string;
  password: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

class PasswordService {
  private baseUrl = '/passwords'; // Adjust to your API endpoint

  // Fetch all passwords
  async getAllPasswords(): Promise<PasswordEntry[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      toast.error('Error fetching passwords');
      return [];
    }
  }

  // Fetch a single password entry
  async getPasswordById(id: string): Promise<PasswordEntry | null> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      toast.error('Error fetching password entry');
      return null;
    }
  }

  // Create a new password entry
  async createPassword(entry: Omit<PasswordEntry, 'id'>): Promise<PasswordEntry | null> {
    try {
      const response = await api.post(this.baseUrl, entry);
      toast.success('Password entry created successfully');
      return response.data;
    } catch (error) {
      toast.error('Error creating password entry');
      return null;
    }
  }

  // Update an existing password entry
  async updatePassword(id: string, entry: Partial<PasswordEntry>): Promise<PasswordEntry | null> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, entry);
      toast.success('Password entry updated successfully');
      return response.data;
    } catch (error) {
      toast.error('Error updating password entry');
      return null;
    }
  }

  // Delete a password entry
  async deletePassword(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
      toast.success('Password entry deleted successfully');
      return true;
    } catch (error) {
      toast.error('Error deleting password entry');
      return false;
    }
  }
}

export default new PasswordService();