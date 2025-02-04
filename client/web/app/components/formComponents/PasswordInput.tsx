import React, { useState } from 'react';
import { Eye, EyeOff, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  showCopyButton?: boolean;
}

export function PasswordInput({
  value,
  onChange,
  label = 'Password',
  placeholder = 'Enter password',
  required = true,
  className = '',
  showCopyButton = true
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success('Password copied to clipboard');
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={isVisible ? 'text' : 'password'}
          id="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-purple-500 
            pr-16 ${className}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
          {showCopyButton && (
            <button
              type="button"
              onClick={handleCopy}
              className="text-gray-400 hover:text-purple-600"
              title="Copy Password"
            >
              <Copy className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={toggleVisibility}
            className="text-gray-400 hover:text-purple-600"
            title={isVisible ? 'Hide Password' : 'Show Password'}
          >
            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}