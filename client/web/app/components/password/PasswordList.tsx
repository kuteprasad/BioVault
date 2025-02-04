import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, Loader } from 'lucide-react';
import passwordService from '../../services/passwordService';
import type { PasswordEntry } from '../../services/passwordService';

export function PasswordList() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPasswords();
  }, []);

  const loadPasswords = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching passwords...');
      const data = await passwordService.getVault();
      console.log('Passwords received:', data);
      setPasswords(data);
    } catch (error: any) {
      console.error('Error loading passwords:', error);
      setError(error.message || 'Failed to load passwords');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      try {
        await passwordService.deletePassword(id);
        await loadPasswords();
      } catch (error) {
        console.error('Error deleting password:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button 
          onClick={loadPasswords}
          className="mt-4 text-purple-600 hover:text-purple-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Passwords</h2>
        <button
          onClick={() => navigate('/new-password')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Add New Password
        </button>
      </div>

      {passwords.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No passwords saved yet.</p>
          <p className="mt-2">Click "Add New Password" to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {passwords.map((password) => (
            <div
              key={password._id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{password.site}</h3>
                  <p className="text-gray-600">{password.username}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/edit-password/${password._id}`)}
                    className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(password._id!)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 