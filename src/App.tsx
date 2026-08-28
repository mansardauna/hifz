import React, { useState } from 'react';
import { TenantProvider, useTenant } from './context/TenantContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SaasLandingPage } from './views/SaasLandingPage';
import { LandingPage } from './components/landing/LandingPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentLMS } from './components/lms/StudentLMS';
import { SignInPage } from './components/auth/SignInPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { CreateAcademyPage } from './views/auth/CreateAcademyPage';
import { ToastContainer, ToastMessage } from './components/ui/Toast';

export type CurrentView = 'saas_home' | 'tenant_public' | 'tenant_admin' | 'student_lms' | 'signin' | 'signup' | 'create_academy' | 'forgot_password';

const AppContent: React.FC = () => {
  const { setTenantBySubdomain, activeRole, setActiveRole } = useTenant();
  const { user } = useAuth();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigateToAuth = (route: string) => {
    if (route.includes('create-academy')) setActiveRole('create_academy' as any);
    else if (route.includes('login') || route.includes('signin')) setActiveRole('signin');
    else if (route.includes('register') || route.includes('signup')) setActiveRole('signup');
    else if (route.includes('forgot')) setActiveRole('forgot-password');
    else setActiveRole('landing');
  };

  const handleNavigateToDemo = (tenantSubdomain: string) => {
    setTenantBySubdomain(tenantSubdomain);
    setActiveRole('landing');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Route Views */}
      <div className="flex-1">
        {activeRole === 'landing' && (
          <LandingPage onAddToast={addToast} />
        )}

        {activeRole === 'admin' && (
          <AdminDashboard
            onAddToast={addToast}
            onViewLiveSite={() => setActiveRole('landing')}
          />
        )}

        {activeRole === 'student' && (
          <StudentLMS onAddToast={addToast} />
        )}

        {activeRole === 'signin' && (
          <SignInPage onAddToast={addToast} />
        )}

        {activeRole === 'signup' && (
          <SignUpPage onAddToast={addToast} />
        )}

        {(activeRole as any) === 'create_academy' && (
          <CreateAcademyPage
            onAddToast={addToast}
            onSuccess={() => setActiveRole('admin')}
          />
        )}

        {(activeRole as any) === 'saas_home' && (
          <SaasLandingPage
            onNavigateToAuth={handleNavigateToAuth}
            onNavigateToDemo={handleNavigateToDemo}
          />
        )}

        {activeRole === 'forgot-password' && (
          <ForgotPasswordPage onAddToast={addToast} />
        )}
      </div>

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <TenantProvider>
        <AppContent />
      </TenantProvider>
    </AuthProvider>
  );
};

export default App;
