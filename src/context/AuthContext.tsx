import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  register: (name: string, email: string, role: UserRole, tenantId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'usr-demo',
    name: 'Abdullah Ahmad',
    email: 'student@hifz.app',
    role: 'student',
    tenantId: 'tenant-1',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  });

  const login = (email: string, role: UserRole) => {
    setUser({
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      role,
      tenantId: 'tenant-1',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    });
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const register = (name: string, email: string, role: UserRole, tenantId: string) => {
    setUser({
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      tenantId,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
