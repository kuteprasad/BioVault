import { useState, useCallback } from 'react';
import { BiometricAuthState } from '../types/auth';
import { matchBiometricData } from '../services/authService';



export const useBiometricAuth = () => {
  const [authState, setAuthState] = useState<BiometricAuthState>({
    isShowing: false,
    isProcessing: false,
    error: null,
    success: false
  });

  const handleBiometricSuccess = useCallback(async (data: { blob: Blob; type: string }) => {
    setAuthState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const formData = new FormData();
      formData.append("biometricData", data.blob);
      formData.append("type", data.type);

      const response = await matchBiometricData(formData);
      
      setAuthState({
        isShowing: false,
        isProcessing: false,
        error: null,
        success: response
      });
    } catch (error) {
      setAuthState({
        isShowing: false,
        isProcessing: false,
        error: 'Authentication failed',
        success: false
      });
    }
  }, []);

  return { authState, setAuthState, handleBiometricSuccess };
};