import { toast } from 'sonner';

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
  private baseUrl = 'localhost:3000/api/passwords'; // Adjust to your API endpoint

  // Fetch all passwords
  async getAllPasswords(): Promise<PasswordEntry[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch passwords');
      }
      return await response.json();
    } catch (error) {
      toast.error('Error fetching passwords');
      return [];
    }
  }

  // Fetch a single password entry
  async getPasswordById(id: string): Promise<PasswordEntry | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch password entry');
      }
      return await response.json();
    } catch (error) {
      toast.error('Error fetching password entry');
      return null;
    }
  }

  // Create a new password entry
  async createPassword(entry: Omit<PasswordEntry, 'id'>): Promise<PasswordEntry | null> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry)
      });

      if (!response.ok) {
        throw new Error('Failed to create password entry');
      }

      const createdEntry = await response.json();
      toast.success('Password entry created successfully');
      return createdEntry;
    } catch (error) {
      toast.error('Error creating password entry');
      return null;
    }
  }

  // Update an existing password entry
  async updatePassword(id: string, entry: Partial<PasswordEntry>): Promise<PasswordEntry | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry)
      });

      if (!response.ok) {
        throw new Error('Failed to update password entry');
      }

      const updatedEntry = await response.json();
      toast.success('Password entry updated successfully');
      return updatedEntry;
    } catch (error) {
      toast.error('Error updating password entry');
      return null;
    }
  }

  // Delete a password entry
  async deletePassword(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete password entry');
      }

      toast.success('Password entry deleted successfully');
      return true;
    } catch (error) {
      toast.error('Error deleting password entry');
      return false;
    }
  }
}

export default new PasswordService();