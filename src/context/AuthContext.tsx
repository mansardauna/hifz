import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'student' | 'teacher' | 'admin' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  avatarUrl?: string;
  cohort?: string;
  level?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, customName?: string) => void;
  logout: () => void;
  register: (name: string, email: string, role: UserRole, tenantId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('auth_user');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return null;
  });

  const login = (email: string, role: UserRole, customName?: string) => {
    let resolvedName = customName;
    if (!resolvedName) {
      const emailUser = email.split('@')[0];
      resolvedName = emailUser
        .split(/[._-]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: resolvedName,
      email,
      role,
      tenantId: 'tenant-1',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(resolvedName)}`,
    };

    setUser(newUser);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('auth_user', JSON.stringify(newUser));
      } catch (e) {}
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('auth_user');
        sessionStorage.removeItem('auth_user');
      } catch (e) {}

      const pathname = window.location.pathname;
      const segments = pathname.split('/').filter(Boolean);
      const rootRoutes = ['login', 'register', 'create-academy', 'super-admin', 'verify'];
      if (segments.length > 0 && !rootRoutes.includes(segments[0])) {
        const subdomain = segments[0];
        window.location.href = `/${subdomain}/login`;
      } else {
        window.location.href = '/login';
      }
    }
  };

  const register = (name: string, email: string, role: UserRole, tenantId: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      tenantId,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('auth_user', JSON.stringify(newUser));
      } catch (e) {}
    }
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
