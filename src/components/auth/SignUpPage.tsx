import React, { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { MOCK_TENANTS } from '../../services/mockData';
import { ToastMessage } from '../ui/Toast';
import { Button, Input, Select, Card } from '../ui';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SignUpPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onSuccess?: (role: UserRole, subdomain: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onAddToast, onSuccess }) => {
  const router = useRouter();
  const { tenant, setTenantBySubdomain } = useTenant();
  const { register } = useAuth();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>(tenant.subdomain);
  const [role, setRole] = useState<UserRole>('student');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      onAddToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please fill in all mandatory account fields.',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setTenantBySubdomain(selectedSubdomain);
      register(name, email, role, selectedSubdomain);
      onAddToast({
        type: 'success',
        title: 'Account Created',
        message: `Welcome to ${name}! Account registered successfully.`,
      });
      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess(role, selectedSubdomain);
      } else {
        if (role === 'admin') {
          router.push(`/${selectedSubdomain}/admin`);
        } else {
          router.push(`/${selectedSubdomain}/lms`);
        }
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full my-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Student Account Registration</h2>
          <p className="text-xs text-slate-500 mt-1">Enroll in online classes and track your learning progress</p>
        </div>

        <Card className="shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Select Academy"
              value={selectedSubdomain}
              onChange={(e) => setSelectedSubdomain(e.target.value)}
              options={Object.values(MOCK_TENANTS).map((t) => ({
                value: t.subdomain,
                label: `${t.name} (${t.subdomain}.hifz.app)`,
              }))}
            />

            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mariam Mansoor"
              leftIcon={<User className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 0199"
                leftIcon={<Phone className="w-4 h-4" />}
              />

              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="font-bold text-slate-900 hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
