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
  private baseUrl = '/password';  

  async getVault(): Promise<PasswordEntry[]> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Attempting to fetch vault');
      const response = await api.get(`${this.baseUrl}/vault`, {
        headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
        }
      });

      console.log('Vault fetch response:', response.data);
      
      // Extract passwords from vault object
      const passwords = response.data.vault?.passwords || [];
      return passwords;
    } catch (error: any) {
      console.error('Vault fetch error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch vault');
      throw error;
    }
  }

  async addPassword(passwordData: Omit<PasswordEntry, '_id' | 'createdAt' | 'updatedAt'>): Promise<PasswordEntry> {
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token found');

      console.log('Adding new password:', {
        site: passwordData.site,
        username: passwordData.username,
        hasNotes: !!passwordData.notes
      });

      const response = await api.post(`${this.baseUrl}/add`, passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Add password response:', response.data);
      toast.success('Password added successfully');
      return response.data.vault.passwords.slice(-1)[0];
    } catch (error: any) {
      console.error('Add password error:', error);
      toast.error(error.response?.data?.message || 'Failed to add password');
      throw error;
    }
  }

  async updatePassword(passwordId: string, updates: Partial<PasswordEntry>): Promise<PasswordEntry> {
    try {
      const token = getToken();
      console.log('Updating password:', {
        passwordId,
        updateFields: Object.keys(updates)
      });

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.put(`${this.baseUrl}/update/${passwordId}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Find the updated password in the response
      const updatedPassword = response.data.vault.passwords.find(
        (p: PasswordEntry) => p._id === passwordId
      );

      if (!updatedPassword) {
        throw new Error('Updated password not found in response');
      }

      console.log('Update password response:', {
        status: response.status,
        updatedPassword
      });

      toast.success('Password updated successfully');
      return updatedPassword;
    } catch (error: any) {
      console.error('Update password error:', {
        message: error.message,
        response: error.response?.data,
        passwordId
      });
      toast.error(error.response?.data?.message || 'Failed to update password');
      throw error;
    }
  }

  async deletePassword(passwordId: string): Promise<void> {
    try {
      
      const token = getToken();
      console.log('func Deleting password:', { passwordId });

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.delete(`${this.baseUrl}/delete/${passwordId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete password response:', {
        status: response.status,
        message: response.data.message
      });

      toast.success('Password deleted successfully');
    } catch (error: any) {
      console.error('Delete password error:', {
        message: error.message,
        response: error.response?.data
      });
      toast.error(error.response?.data?.message || 'Failed to delete password');
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

  async getPasswordById(passwordId: string): Promise<PasswordEntry | null> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching password by ID:', passwordId);
      
      const response = await api.get(`${this.baseUrl}/${passwordId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Get password by ID response:', {
        status: response.status,
        data: response.data
      });
      return response.data.password || null;
      // console.log(response)
      // // Return the password entry from the vault
      // const password = response.data.password.find(
      //   (p: PasswordEntry) => p._id === passwordId
      // );

      // if (!password) {
      //   console.log('Password not found in vault');
      //   return null;
      // }

      // return password;
    } catch (error: any) {
      console.error('Get password by ID error:', {
        message: error.message,
        response: error.response?.data
      });
      toast.error(error.response?.data?.message || 'Failed to fetch password');
      throw error;
    }
  }

  // Add a new method to get decrypted password for editing
  async getPasswordForEdit(passwordId: string): Promise<PasswordEntry> {
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token found');

      const response = await api.get(`${this.baseUrl}/${passwordId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // The password should already be decrypted in the response
      return response.data.password;
    } catch (error: any) {
      console.error('Get password for edit error:', error);
      toast.error(error.response?.data?.message || 'Failed to get password');
      throw error;
    }
  }
}

export default new PasswordService();