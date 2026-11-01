import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  quickLoginDemo: (type: 'merchant' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const token = api.getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
    } catch (err) {
      console.warn('Session expired or invalid:', err);
      api.clearToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email.trim(), password);
    setUser(res.user);
  };

  const register = async (name: string, email: string, password: string, confirmPassword?: string) => {
    const res = await api.register(name.trim(), email.trim(), password, confirmPassword);
    setUser(res.user);
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  const quickLoginDemo = async (type: 'merchant' | 'admin') => {
    if (type === 'admin') {
      try {
        await login('admin@catafy.com', 'admin123');
      } catch {
        await login('admin@catalogohub.com', 'admin123');
      }
    } else {
      try {
        await login('demo@catafy.com', 'demo123');
      } catch {
        await login('demo@catalogohub.com', 'demo123');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        quickLoginDemo,
      }}
    >
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
