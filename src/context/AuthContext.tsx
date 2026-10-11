import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { initialUsers } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  register: (name: string, email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'flashads_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialUsers[0]; // Default logged in as Alexander Wright
    } catch {
      return initialUsers[0];
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = (email: string): boolean => {
    const existing = initialUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
    } else {
      // Mock log in as newly authenticated admin
      setCurrentUser({
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'Super Admin',
        phone: '+1 (555) 000-1122',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        lastActive: 'Just now',
      });
    }
    return true;
  };

  const register = (name: string, email: string): boolean => {
    setCurrentUser({
      id: `usr-${Date.now()}`,
      name,
      email,
      role: 'Super Admin',
      phone: '+1 (555) 000-1122',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      lastActive: 'Just now',
    });
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        register,
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
