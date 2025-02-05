import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import PasswordService from '../../services/passwordService';
import type { PasswordEntry } from '../../services/passwordService';
import { FormLayout } from '../../components/formComponents/FormLayout';
import { TextInput } from '../../components/formComponents/TextInput';
import { PasswordInput } from '../../components/formComponents/PasswordInput';
import { TextareaInput } from '../../components/formComponents/TextareaInput';

export default function EditPasswordForm() {
  const [formData, setFormData] = useState<Partial<PasswordEntry>>({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchPasswordEntry(id);
    }
  }, [id]);

  const fetchPasswordEntry = async (entryId: string) => {
    try {
      // const entry = await PasswordService.getPasswordById(entryId);
      const entry = await PasswordService.getPasswordById(entryId);
      if (entry) {
        setFormData(entry);
      } else {
        toast.error('Password entry not found');
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to load password entry');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.site || !formData.username || !formData.passwordEncrypted) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (id) {
        const updatedEntry = await PasswordService.updatePassword(id, {
          site: formData.site,
          username: formData.username,
          passwordEncrypted: formData.passwordEncrypted,
          notes: formData.notes
        });
        
        if (updatedEntry) {
          toast.success('Password entry updated successfully');
          navigate('/');
        }
      }
    } catch (error) {
      toast.error('Failed to update password entry');
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
    <FormLayout 
      title="Edit Password" 
      onSubmit={handleSubmit}
      submitButtonText="Update Password"
    >
      <TextInput
        label="Website URL"
        type="url"
        value={formData.site || ''}
        onChange={(site) => setFormData(prev => ({ ...prev, site }))}
        placeholder="https://example.com"
        required
      />

      <TextInput
        label="Username"
        value={formData.username || ''}
        onChange={(username) => setFormData(prev => ({ ...prev, username }))}
        placeholder="Enter username"
        required
      />

      <PasswordInput
        value={formData.passwordEncrypted || ''}
        onChange={(passwordEncrypted) => setFormData(prev => ({ ...prev, passwordEncrypted }))}
        required
      />

      <TextareaInput
        label="Notes (Optional)"
        value={formData.notes || ''}
        onChange={(notes) => setFormData(prev => ({ ...prev, notes }))}
        placeholder="Additional notes or context"
      />
    </FormLayout>
  );
}