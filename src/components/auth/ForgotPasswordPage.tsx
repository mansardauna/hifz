import React, { useState } from 'react';
import { ToastMessage } from '../ui/Toast';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ForgotPasswordPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onAddToast }) => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitted(true);
    onAddToast({
      type: 'success',
      title: 'Reset Instructions Sent',
      message: 'Check your email inbox for password recovery link.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full my-8">
        <div className="bg-white rounded-sm p-6 sm:p-8 shadow-sm border border-slate-200">
          {!submitted ? (
            <>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Reset Password</h2>
              <p className="text-xs text-slate-500 mb-6">
                Enter your registered student or teacher email address to receive password reset instructions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-sm shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Check Your Inbox</h3>
              <p className="text-xs text-slate-600">
                We sent a password reset link to <strong className="text-slate-900">{email}</strong>.
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-slate-500 hover:text-slate-900 font-semibold cursor-pointer"
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
