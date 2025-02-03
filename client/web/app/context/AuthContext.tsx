import React, { createContext, useState, useEffect } from 'react';
import type {ReactNode} from 'react';
import { getToken, removeToken } from '../utils/authUtils';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
  }

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      // Decode token to set user data if needed
    }
  }, []);

  const login = (token: string) => {
    setIsAuthenticated(true);
    // Optionally decode token and set user data here
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    removeToken(); // Remove token from local storage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};