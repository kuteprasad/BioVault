import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PasswordService from '../../services/passwordService';
import type { PasswordEntry } from '../../services/passwordService';
import { FormLayout } from '../../components/formComponents/FormLayout';
import { TextInput } from '../../components/formComponents/TextInput';
import { PasswordInput } from '../../components/formComponents/PasswordInput';
import { TextareaInput } from '../../components/formComponents/TextareaInput';

export default function NewPasswordForm() {
  const [formData, setFormData] = useState<Omit<PasswordEntry, '_id' | 'createdAt' | 'updatedAt'>>({
    site: '',
    username: '',
    passwordEncrypted: '',
    notes: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.site || !formData.username || !formData.passwordEncrypted) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const newEntry = await PasswordService.addPassword(formData);
      
      if (newEntry) {
        toast.success('New password entry created successfully');
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to create password entry');
    }
  };

  return (
    <FormLayout 
      title="Add New Password" 
      onSubmit={handleSubmit}
      submitButtonText="Save Password"
    >
      <TextInput
        label="Website URL"
        type="url"
        value={formData.site}
        onChange={(site) => setFormData(prev => ({ ...prev, site }))}
        placeholder="https://example.com"
        required
      />

      <TextInput
        label="Username"
        value={formData.username}
        onChange={(username) => setFormData(prev => ({ ...prev, username }))}
        placeholder="Enter username"
        required
      />

      <PasswordInput
        value={formData.passwordEncrypted}
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