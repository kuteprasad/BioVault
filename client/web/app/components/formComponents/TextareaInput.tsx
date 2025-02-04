import React from 'react';

interface TextareaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
}

export function TextareaInput({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  className = ''
}: TextareaInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={label.toLowerCase().replace(/\s+/g, '-')} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={label.toLowerCase().replace(/\s+/g, '-')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
      />
    </div>
  );
}