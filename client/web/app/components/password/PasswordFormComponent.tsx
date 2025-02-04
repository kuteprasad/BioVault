import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormLayout } from '../formComponents/FormLayout';
import { TextInput } from '../formComponents/TextInput';
import { PasswordInput } from '../formComponents/PasswordInput';
import { TextareaInput } from '../formComponents/TextareaInput';
import passwordService from '../../services/passwordService';

interface PasswordFormProps {
  initialData?: {
    _id?: string;
    site: string;
    username: string;
    passwordEncrypted: string;
    notes?: string;
  };
  mode: 'add' | 'edit';
}

export function PasswordFormComponent({ initialData, mode }: PasswordFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    site: initialData?.site || '',
    username: initialData?.username || '',
    passwordEncrypted: initialData?.passwordEncrypted || '',
    notes: initialData?.notes || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'add') {
        await passwordService.addPassword(formData);
      } else if (mode === 'edit' && initialData?._id) {
        await passwordService.updatePassword(initialData._id, formData);
      }
      navigate('/'); // Navigate back to vault view
      
    } catch (error) {
      console.error('Error saving password:', error);
    }
  };

  return (
    <FormLayout
      title={mode === 'add' ? 'Add New Password' : 'Edit Password'}
      onSubmit={handleSubmit}
      submitButtonText={mode === 'add' ? 'Add Password' : 'Update Password'}
      backPath="/"
    >
      <TextInput
        label="Website"
        type="url"
        value={formData.site}
        onChange={(value) => setFormData(prev => ({ ...prev, site: value }))}
        placeholder="https://example.com"
        required
      />

      <TextInput
        label="Username"
        value={formData.username}
        onChange={(value) => setFormData(prev => ({ ...prev, username: value }))}
        placeholder="username@example.com"
        required
      />

      <PasswordInput
        label="Password"
        value={formData.passwordEncrypted}
        onChange={(value) => setFormData(prev => ({ ...prev, passwordEncrypted: value }))}
        required
      />

      <TextareaInput
        label="Notes"
        value={formData.notes || ''}
        onChange={(value) => setFormData(prev => ({ ...prev, notes: value }))}
        placeholder="Add any additional notes here..."
      />
    </FormLayout>
  );
} 