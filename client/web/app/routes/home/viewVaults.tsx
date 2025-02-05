import { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, ExternalLink, Calendar, Copy, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PasswordService from '../../services/passwordService';
import type { PasswordEntry } from '../../services/passwordService';

// Sample data for development
const samplePasswords: PasswordEntry[] = [
  {
    _id: '1',
    site: 'https://github.com',
    username: 'devuser123',
    passwordEncrypted: 'SecurePass123!',
    notes: 'GitHub personal account',
    createdAt: new Date('2024-03-15').toISOString(),
    updatedAt: new Date('2024-03-15').toISOString()
  },
  {
    _id: '2',
    site: 'https://netflix.com',
    username: 'netflixuser',
    passwordEncrypted: 'NetflixPass456!',
    notes: 'Family Netflix account',
    createdAt: new Date('2024-03-14').toISOString(),
    updatedAt: new Date('2024-03-14').toISOString()
  },
  {
    _id: '3',
    site: 'https://amazon.com',
    username: 'shopper789',
    passwordEncrypted: 'AmazonShop789!',
    notes: 'Prime shopping account',
    createdAt: new Date('2024-03-13').toISOString(),
    updatedAt: new Date('2024-03-13').toISOString()
  }
];

export default function ViewVaults() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [visiblePasswordId, setVisiblePasswordId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      setIsLoading(true);
      const fetchedPasswords = await PasswordService.getVault();
      console.log('Fetched passwords:', fetchedPasswords);
      setPasswords(fetchedPasswords);
    } catch (error) {
      console.error('Error fetching passwords:', error);
      toast.error('Failed to fetch passwords');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (passwordId: string) => {
    console.log('Toggling visibility for password:', passwordId);
    setVisiblePasswordId(prev => prev === passwordId ? null : passwordId);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this password entry?');
    if (confirmed) {
      try {
        await PasswordService.deletePassword(id);
        // Remove the deleted entry from local state
        setPasswords(prev => prev.filter(p => p._id !== id));
      } catch (error) {
        console.error('Error deleting password:', error);
      }
    }
  };

  // Helper function to format URL
  const formatUrl = (url: string): string => {
    try {
      // Add https:// if no protocol is specified
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      const urlObject = new URL(url);
      return urlObject.hostname;
    } catch (error) {
      console.log('Invalid URL:', url);
      return url; // Return original string if URL is invalid
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Password Vault</h1>
        <button
          onClick={() => navigate('/new-password')}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white 
            rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Add New Password
        </button>
      </div>

      {passwords.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
          <p className="text-gray-500 text-lg">
            No passwords saved yet. Add your first password!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-purple-50 border-b border-gray-200">
                <tr>
                  {['Site', 'Username', 'Password', 'Notes', 'Last Updated', 'Actions'].map((header) => (
                    <th 
                      key={header}
                      className="px-6 py-4 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {passwords.map((password) => (
                  <tr 
                    key={password._id} 
                    className="hover:bg-purple-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={password.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 flex items-center gap-2 font-medium group"
                      >
                        {formatUrl(password.site)}
                        <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{password.username}</span>
                        <button 
                          onClick={() => copyToClipboard(password.username, 'Username')}
                          className="text-gray-400 hover:text-purple-600"
                          title="Copy Username"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">
                          {visiblePasswordId == password._id!
                            ? password.passwordEncrypted
                            : '••••••••'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePasswordVisibility(password._id!)}
                            className="text-gray-400 hover:text-purple-600"
                            title={visiblePasswordId == password._id! ? 'Hide Password' : 'Show Password'}
                          >
                            {visiblePasswordId == password._id! 
                              ? <EyeOff className="h-4 w-4" />
                              : <Eye className="h-4 w-4" />}
                          </button>
                          <button 
                            onClick={() => copyToClipboard(password.passwordEncrypted, 'Password')}
                            className="text-gray-400 hover:text-purple-600"
                            title="Copy Password"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {password.notes || <span className="text-gray-400 italic">No notes</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        {password.updatedAt 
                          ? new Date(password.updatedAt).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => navigate(`/edit-password/${password._id!}`)}
                          className="text-gray-400 hover:text-purple-600"
                          title="Edit Entry"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => password._id && handleDelete(password._id!)}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete Entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}