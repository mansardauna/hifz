import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { ToastMessage } from '../../components/ui/Toast';
import { Building2, Globe, Mail, Lock, User, CheckCircle2, ArrowRight } from 'lucide-react';

interface CreateAcademyPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onSuccess: () => void;
}

export const CreateAcademyPage: React.FC<CreateAcademyPageProps> = ({
  onAddToast,
  onSuccess,
}) => {
  const { register } = useAuth();
  const { language } = useTenant();

  const [academyName, setAcademyName] = useState<string>('');
  const [subdomain, setSubdomain] = useState<string>('');
  const [adminName, setAdminName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('Madrasah Growth ($149/mo)');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!academyName || !subdomain || !adminName || !email || !password) {
      onAddToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please complete all fields to register your academy.',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      register(adminName, email, 'admin', subdomain);
      onAddToast({
        type: 'success',
        title: 'Academy Setup Completed',
        message: `Welcome to ${academyName}! Your subdomain ${subdomain}.hifz.app is ready.`,
      });
      setIsSubmitting(false);
      onSuccess();
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-xl w-full my-8">
        <div className="text-center mb-6">
          <div className="inline-block px-3 py-1 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-sm mb-2">
            Custom Academy Institute Setup
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Launch Your Academy in Minutes</h2>
          <p className="text-xs text-slate-500 mt-1">14-day free trial • Real GrapesJS visual editor included</p>
        </div>

        <div className="bg-white rounded-sm p-6 sm:p-8 shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Academy / Madrasah Name</label>
              <input
                type="text"
                value={academyName}
                onChange={(e) => {
                  setAcademyName(e.target.value);
                  if (!subdomain) {
                    setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                  }
                }}
                placeholder="e.g. Al-Furqan Quran Academy"
                className="w-full p-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Choose Subdomain Name</label>
              <div className="flex items-center rounded-sm border border-slate-300 overflow-hidden">
                <span className="pl-3 text-slate-400 font-mono text-[11px]">https://</span>
                <input
                  type="text"
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  placeholder="al-furqan"
                  className="flex-1 py-2.5 px-1 font-mono font-bold text-teal-800 focus:outline-none"
                />
                <span className="pr-3 text-slate-400 font-mono text-[11px]">.hifz.app</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Founder / Admin Full Name</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Shaykh Ahmad Al-Mansoor"
                  className="w-full p-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Admin Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@academy.com"
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

            <div>
              <label className="block font-semibold text-slate-700 mb-1">SaaS Subscription Tier</label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-sm bg-white focus:outline-none"
              >
                <option value="Independent Tutor ($49/mo)">Independent Qari / Tutor ($49/mo)</option>
                <option value="Madrasah Growth ($149/mo)">Madrasah & Institute ($149/mo)</option>
                <option value="Global Network ($399/mo)">Global Quran Network ($399/mo)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-sm shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-4"
            >
              <span>{isSubmitting ? 'Provisioning Academy...' : 'Launch Academy Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
