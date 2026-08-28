import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { X, User, Settings, Camera, Mail, Phone, Lock, Globe, Bell, Shield, Save } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, onAddToast }) => {
  const { user } = useAuth();
  const { tenant, language, setLanguage } = useTenant();

  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  // Profile Form State
  const [name, setName] = useState<string>(user?.name || 'Abdullah Ahmad');
  const [email, setEmail] = useState<string>(user?.email || 'user@hifz.app');
  const [phone, setPhone] = useState<string>('+1 (555) 345-6789');
  const [bio, setBio] = useState<string>('Dedicated student of Quranic studies and Tajweed recitation.');

  // Password / Settings Form State
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [smsNotifications, setSmsNotifications] = useState<boolean>(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      onAddToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your personal information has been saved successfully.',
      });
    }, 400);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      onAddToast({
        type: 'error',
        title: 'Password Mismatch',
        message: 'New password and confirmation password do not match.',
      });
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onAddToast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Security and preference settings have been updated.',
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center font-bold text-lg text-emerald-100 shadow-inner">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{name}</h3>
              <p className="text-xs text-emerald-300/80 font-mono capitalize">
                {user?.role || 'student'} Account • {tenant?.name || 'Academy'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Account & Security Settings</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Avatar Section */}
              <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-emerald-700 text-white font-bold text-2xl flex items-center justify-center shadow-md">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onAddToast({
                        type: 'info',
                        title: 'Avatar Upload',
                        message: 'Custom avatar upload feature initialized.',
                      })
                    }
                    className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Profile Photo</h4>
                  <p className="text-xs text-slate-500 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute top-2.5 left-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute top-2.5 left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Academy Account Role</label>
                  <input
                    type="text"
                    disabled
                    value={user?.role?.toUpperCase() || 'STUDENT'}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-xs font-bold text-slate-500 capitalize cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bio & Learning Notes</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-md shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Password Change */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-700" />
                  <span>Update Account Password</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Language & Preferences */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-700" />
                  <span>Language & Regional Preferences</span>
                </h4>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-slate-900">Interface Display Language</p>
                    <p className="text-[11px] text-slate-500">Choose between English and Arabic (RTL)</p>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 bg-slate-200 rounded-md">
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        language === 'en' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('ar')}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        language === 'ar' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      العربية (RTL)
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-700" />
                  <span>Notification Subscriptions</span>
                </h4>

                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="font-semibold text-slate-800">Email Alerts (Homework Feedback, Invoices)</span>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="font-semibold text-slate-800">SMS Class Reminders & Notifications</span>
                    <input
                      type="checkbox"
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Security */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-700" />
                  <span>Security & Authentication</span>
                </h4>

                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 block">Two-Factor Authentication (2FA)</span>
                    <span className="text-[10px] text-slate-500">Require an authenticator code when signing into your account</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorAuth}
                    onChange={(e) => setTwoFactorAuth(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-md shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
