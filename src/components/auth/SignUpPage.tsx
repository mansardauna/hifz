import React, { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { MOCK_TENANTS } from '../../services/mockData';
import { ToastMessage } from '../ui/Toast';
import { Button, Input, Select, Card, Badge } from '../ui';
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sparkles,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthHeroIllustration } from '../illustrations/Illustrations2D';

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
        message: `Welcome, ${name}! Account registered successfully.`,
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-extrabold text-slate-900 text-sm">Hifz OS</span>
        </div>

        <button
          onClick={() => router.push('/login')}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          Sign In &rarr;
        </button>
      </header>

      {/* Main Split-Screen Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 rounded-2xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Left Hero Visual Card */}
          <div className="hidden lg:flex flex-col justify-between p-8 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 text-[10px] font-bold border border-slate-700">
                <Sparkles className="w-3 h-3" />
                <span>Instant Student Enrollment</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
                Join Your Academy Classroom
              </h2>

              <p className="text-xs text-slate-400 leading-relaxed">
                Enroll in online courses, stream live Uthmani verses with recitation looping, and submit audio homework directly to certified instructors.
              </p>
            </div>

            {/* 2D Vector Graphic */}
            <div className="my-6 max-w-[280px] mx-auto">
              <AuthHeroIllustration className="w-full h-auto" />
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-1 relative z-10">
              <p className="font-serif text-base text-emerald-300 font-bold">
                خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
              </p>
              <p className="text-[10px] text-slate-400 italic">
                &ldquo;The best of you are those who learn the Quran and teach it&rdquo; • Sahih Al-Bukhari
              </p>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="p-6 sm:p-10 flex flex-col justify-center space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Create Student Account
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Register to begin your online learning journey.
              </p>
            </div>

            {/* Form */}
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
                placeholder="e.g. Zayd Al-Mansoor"
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

                <Select
                  label="Account Type"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  options={[
                    { value: 'student', label: 'Student Learner' },
                    { value: 'admin', label: 'Academy Admin' },
                  ]}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center shadow-xs"
                disabled={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </form>

            <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="font-bold text-slate-900 hover:underline cursor-pointer"
              >
                Sign In &rarr;
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400">
        © 2026 Hifz LMS Inc. • Multitenant Educational Platform
      </footer>
    </div>
  );
};
