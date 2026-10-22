import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPlatformRootDomain } from '../lib/platformDomain';

export type UserRole = 'student' | 'teacher' | 'admin' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  tenantSubdomain?: string;
  avatarUrl?: string;
  cohort?: string;
  level?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    emailOrUser: string | Partial<User>,
    role?: UserRole,
    customName?: string,
    token?: string,
    tenantId?: string,
    userId?: string,
    avatarUrl?: string,
    tenantSubdomain?: string
  ) => void;
  logout: () => void;
  register: (name: string, email: string, role: UserRole, tenantId: string, userId?: string, tenantSubdomain?: string) => void;
  switchDemoRole: (role: UserRole) => void;
  isUserValidForSubdomain: (subdomain: string, currentTenantId?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start null on both SSR and initial client mount to guarantee 0 hydration mismatch (React error #423)
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from localStorage safely after client hydration
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        const parsed: User = JSON.parse(stored);
        // Detect current path to prevent session bleed across subdomains
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        const rootRoutes = ['login', 'register', 'create-academy', 'super-admin', 'verify', 'api'];
        if (pathSegments.length > 0 && !rootRoutes.includes(pathSegments[0])) {
          const currentSub = pathSegments[0].toLowerCase();
          // If user is not superadmin, verify their tenant belongs to this subdomain
          if (parsed.role !== 'superadmin') {
            const userTenant = (parsed.tenantId || '').toLowerCase();
            const userSub = (parsed.tenantSubdomain || '').toLowerCase();
            const isMatch =
              (userSub && userSub === currentSub) ||
              userTenant === currentSub ||
              userTenant === `tenant-${currentSub}` ||
              userTenant.includes(currentSub);
            if (!isMatch) {
              setUser(null);
              setIsLoading(false);
              return;
            }
          }
        }
        setUser(parsed);
      }
    } catch (e) {
      console.warn('Auth restoration error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isUserValidForSubdomain = (subdomain: string, currentTenantId?: string): boolean => {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    const cleanSub = (subdomain || '').replace(/^tenant-/, '').toLowerCase().trim();
    const userTenant = (user.tenantId || '').replace(/^tenant-/, '').toLowerCase().trim();
    const userSub = (user.tenantSubdomain || '').replace(/^tenant-/, '').toLowerCase().trim();

    // 1. Explicit tenant subdomain match
    if (userSub && userSub === cleanSub) return true;

    // 2. Database CUID match from active tenant record
    if (currentTenantId) {
      const cleanCurrent = currentTenantId.replace(/^tenant-/, '').toLowerCase().trim();
      if (user.tenantId === currentTenantId || userTenant === cleanCurrent) return true;
    }

    // 3. Fallback subdomain slug matches
    if (userTenant === cleanSub || user.tenantId === `tenant-${cleanSub}` || user.tenantId === cleanSub) return true;

    // 4. Demo workspace match
    if ((cleanSub === 'demo' || cleanSub === 'sample-demo') && (userTenant === 'tenant-demo' || userTenant === 'demo')) return true;

    return false;
  };

  const login = (
    emailOrUser: string | Partial<User>,
    role?: UserRole,
    customName?: string,
    token?: string,
    tenantId?: string,
    userId?: string,
    avatarUrl?: string,
    tenantSubdomain?: string
  ) => {
    let resolvedUser: User;

    if (typeof emailOrUser === 'object' && emailOrUser !== null) {
      resolvedUser = {
        id: emailOrUser.id || userId || `usr-${Date.now()}`,
        name: emailOrUser.name || 'Academy Member',
        email: emailOrUser.email || '',
        role: (emailOrUser.role as UserRole) || 'student',
        tenantId: emailOrUser.tenantId || tenantId || '',
        tenantSubdomain: emailOrUser.tenantSubdomain || (emailOrUser as any).subdomain || tenantSubdomain,
        avatarUrl: emailOrUser.avatarUrl || avatarUrl,
      };
    } else {
      let resolvedName = customName;
      if (!resolvedName) {
        const emailUser = String(emailOrUser).split('@')[0];
        resolvedName = emailUser
          .split(/[._-]/)
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ');
      }

      resolvedUser = {
        id: userId || `usr-${Date.now()}`,
        name: resolvedName,
        email: String(emailOrUser),
        role: role || 'student',
        tenantId: tenantId || '',
        tenantSubdomain: tenantSubdomain,
        avatarUrl: avatarUrl || undefined,
      };
    }

    setUser(resolvedUser);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('auth_user', JSON.stringify(resolvedUser));
        if (resolvedUser.tenantId) {
          localStorage.setItem(`auth_user_${resolvedUser.tenantId}`, JSON.stringify(resolvedUser));
        }
        if (resolvedUser.tenantSubdomain) {
          localStorage.setItem(`auth_user_${resolvedUser.tenantSubdomain}`, JSON.stringify(resolvedUser));
        }
        if (token) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('ankabit_auth_token', token);
        }
      } catch (e) {}
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('ankabit_auth_token');
        sessionStorage.removeItem('auth_user');
      } catch (e) {}

      // Clear cookie
      document.cookie = 'hifz_session=; Max-Age=0; path=/;';

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

  const register = (name: string, email: string, role: UserRole, tenantId: string, userId?: string, tenantSubdomain?: string) => {
    const newUser: User = {
      id: userId || `usr-${Date.now()}`,
      name,
      email,
      role,
      tenantId,
      tenantSubdomain,
      avatarUrl: undefined,
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        if (tenantId) {
          localStorage.setItem(`auth_user_${tenantId}`, JSON.stringify(newUser));
        }
        if (tenantSubdomain) {
          localStorage.setItem(`auth_user_${tenantSubdomain}`, JSON.stringify(newUser));
        }
      } catch (e) {}
    }
  };

  const switchDemoRole = (role: UserRole) => {
    let demoName = 'Ustadha Fatima Al-Zahra';
    let demoEmail = 'admin@alfurqan.edu';
    let demoAvatar = '/images/muslim_teacher_woman.jpg';

    if (role === 'teacher') {
      demoName = 'Ustadha Zainab Al-Fayez';
      demoEmail = 'sheikh@alfurqan.edu';
      demoAvatar = '/images/muslim_teacher_woman.jpg';
    } else if (role === 'student') {
      demoName = 'Maryam Al-Mansoor';
      demoEmail = 'student@alfurqan.edu';
      demoAvatar = '/images/muslim_girl_student.jpg';
    } else if (role === 'superadmin') {
      demoName = 'Platform SuperAdmin';
      demoEmail = `superadmin@${getPlatformRootDomain()}`;
      demoAvatar = '/images/muslim_teacher_woman.jpg';
    }

    const newUser: User = {
      id: `usr-demo-${role}`,
      name: demoName,
      email: demoEmail,
      role,
      tenantId: user?.tenantId || 'tenant-demo',
      tenantSubdomain: user?.tenantSubdomain || 'liwan-academy',
      avatarUrl: demoAvatar,
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
        isLoading,
        login,
        logout,
        register,
        switchDemoRole,
        isUserValidForSubdomain,
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
