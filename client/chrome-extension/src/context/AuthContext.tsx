import { createContext, useContext, useState, useEffect } from 'react';
import type { ExtensionMessage } from '../types/messages';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const getExtensionToken = (): Promise<string | null> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['authToken'], (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting token:", chrome.runtime.lastError);
        resolve(null);
      } else {
        resolve(result.authToken || null);
      }
    });
  });
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const extensionToken = await getExtensionToken();
      if (extensionToken) {
        setToken(extensionToken);
        setIsAuthenticated(true);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const messageListener = (message: ExtensionMessage) => {
      if (message.type === 'AUTH_CHANGED') {
        setToken(message.token);
        setIsAuthenticated(true);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, []);

  const login = (newToken: string) => {
    chrome.storage.local.set({ authToken: newToken }, () => {
      setToken(newToken);
      setIsAuthenticated(true);
    });
  };

  const logout = () => {
    chrome.storage.local.remove('authToken', () => {
      setToken(null);
      setIsAuthenticated(false);
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};