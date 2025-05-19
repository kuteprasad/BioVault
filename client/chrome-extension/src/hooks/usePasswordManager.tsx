import { useState, useCallback, useMemo } from 'react';
import { PasswordEntry } from '../types/passwords';

export const usePasswordManager = (allPasswords: PasswordEntry[], currentUrl: string) => {
  const filteredPasswords = useMemo(() => {
    return allPasswords.filter((password) => {
      try {
        const passwordUrl = new URL(password.site).origin;
        return passwordUrl === currentUrl;
      } catch {
        return false;
      }
    });
  }, [allPasswords, currentUrl]);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = useCallback((password: PasswordEntry, isAuthenticated: boolean = false) => {
    if (!isAuthenticated) {
      console.error("Authentication required to copy password");
      return false;
    }
    
    navigator.clipboard.writeText(password.passwordEncrypted);
    setCopiedId(password._id);
    setTimeout(() => setCopiedId(null), 2000);
    return true;
  }, []);

  return { filteredPasswords, copiedId, copyToClipboard };
};