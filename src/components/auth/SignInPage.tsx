import React, { useState, useMemo } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { MOCK_TENANTS } from '../../services/mockData';
import { ToastMessage } from '../ui/Toast';
import { Button, Input, Card } from '../ui';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SignInPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onSuccess?: (role: UserRole, subdomain: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onAddToast, onSuccess }) => {
  const router = useRouter();
  const { tenant, setTenantBySubdomain } = useTenant();
  const { login } = useAuth();

  const [activeRole, setActiveRole] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState<string>('student@al-furqan.com');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const detectedTenant = useMemo(() => {
    const lowerEmail = email.toLowerCase().trim();
    if (lowerEmail.includes('bayyinah')) {
      return MOCK_TENANTS['bayyinah-arabic'] || tenant;
    }
    if (lowerEmail.includes('dar-alquran') || lowerEmail.includes('dar')) {
      return MOCK_TENANTS['dar-alquran'] || tenant;
    }
    if (lowerEmail.includes('al-furqan') || lowerEmail.includes('furqan')) {
      return MOCK_TENANTS['al-furqan'] || tenant;
    }
    return tenant || MOCK_TENANTS['al-furqan'];
  }, [email, tenant]);

  const handleRoleChange = (role: 'student' | 'admin') => {
    setActiveRole(role);
    if (role === 'admin') {
      setEmail('admin@al-furqan.com');
    } else {
      setEmail('student@al-furqan.com');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      onAddToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide both email and password.',
      });
      return;
    }

    setIsSubmitting(true);
    setTenantBySubdomain(detectedTenant.subdomain);
    login(email, activeRole);
    onAddToast({
      type: 'success',
      title: 'Signed In Successfully',
      message: `Welcome back!`,
    });

    if (onSuccess) {
      onSuccess(activeRole, detectedTenant.subdomain);
    } else {
      if (activeRole === 'admin') {
        router.push(`/${detectedTenant.subdomain}/admin`);
      } else {
        router.push(`/${detectedTenant.subdomain}/lms`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In to Your Account</h2>
          <p className="text-xs text-slate-500 mt-1">Access your academy dashboard or student learning portal</p>
        </div>

        <Card className="shadow-sm">
          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg mb-5">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeRole === 'student'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-slate-700" />
              <span>Student Portal</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span>Academy Admin</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={activeRole === 'admin' ? 'Administrator Email' : 'Student Email'}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@academy.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {activeRole === 'admin' ? 'Sign In as Admin' : 'Sign In as Student'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Want to launch a new academy? </span>
            <button
              type="button"
              onClick={() => router.push('/create-academy')}
              className="font-bold text-slate-900 hover:underline cursor-pointer"
            >
              Register Here
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
