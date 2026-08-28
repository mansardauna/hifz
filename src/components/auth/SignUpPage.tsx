import React, { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { MOCK_TENANTS } from '../../services/mockData';
import { ToastMessage } from '../ui/Toast';
import { User, Mail, Lock, Phone, ArrowRight, Building2 } from 'lucide-react';
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
        title: 'Validation Error',
        message: 'Please complete all required registration fields.',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setTenantBySubdomain(selectedSubdomain);
      register(name, email, role, selectedSubdomain);
      onAddToast({
        type: 'success',
        title: 'Registration Complete',
        message: 'Your student portal account has been created.',
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
          <h2 className="text-2xl font-bold text-slate-900">Student Account Registration</h2>
          <p className="text-xs text-slate-500 mt-1">Enroll in Quran recitation classes and track your progress</p>
        </div>

        <div className="bg-white rounded-sm p-6 sm:p-8 shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select School / Academy</label>
              <select
                value={selectedSubdomain}
                onChange={(e) => setSelectedSubdomain(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold cursor-pointer"
              >
                {Object.values(MOCK_TENANTS).map((t) => (
                  <option key={t.subdomain} value={t.subdomain}>
                    {t.name} ({t.subdomain}.hifz.app)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Student Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mariam Mansoor"
                className="w-full p-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 50 123 4567"
                  className="w-full p-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full p-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full p-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-sm shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{isSubmitting ? 'Registering...' : 'Complete Enrollment'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="font-bold text-teal-700 hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
