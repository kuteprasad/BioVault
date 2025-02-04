import React from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FormLayoutProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  submitButtonText?: string;
  backPath?: string;
}

export function FormLayout({
  title,
  onSubmit,
  children,
  submitButtonText = 'Save',
  backPath = '/'
}: FormLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            type="button"
            onClick={() => navigate(backPath)}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {children}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white 
                rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-md"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}