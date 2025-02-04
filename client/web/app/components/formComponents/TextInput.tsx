import React from 'react';

interface TextInputProps {
  label: string;
  type?: 'text' | 'url' | 'email';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function TextInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = ''
}: TextInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={label.toLowerCase().replace(/\s+/g, '-')} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={label.toLowerCase().replace(/\s+/g, '-')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
      />
    </div>
  );
}