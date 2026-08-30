import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Button, Input, Card, Badge } from '../ui';
import { User, Settings, Mail, Phone, Lock, Save, ShieldCheck } from 'lucide-react';

interface UserProfilePageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ onAddToast }) => {
  const { user } = useAuth();
  const { tenant } = useTenant();

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Profile Form State
  const [name, setName] = useState<string>(user?.name || 'Abdullah Ahmad');
  const [email, setEmail] = useState<string>(user?.email || 'user@hifz.app');
  const [phone, setPhone] = useState<string>('+1 (555) 345-6789');

  // Password / Security Form State
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isSaving, setIsSaving] = useState<boolean>(false);

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
    }, 300);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
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
        title: 'Security Updated',
        message: 'Your account password has been updated.',
      });
    }, 300);
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      {/* Header Card */}
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{name}</h2>
              <Badge variant="success">{user?.role?.toUpperCase() || 'STUDENT'}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{email} • {tenant?.name || 'Academy'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'profile' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('profile')}
            leftIcon={<User className="w-3.5 h-3.5" />}
          >
            Personal Details
          </Button>

          <Button
            variant={activeTab === 'security' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('security')}
            leftIcon={<Lock className="w-3.5 h-3.5" />}
          >
            Security & Password
          </Button>
        </div>
      </Card>

      {/* Main Settings Panel */}
      <Card>
        {activeTab === 'profile' ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
              />

              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
              />

              <Input
                label="Organization / Academy"
                type="text"
                disabled
                value={tenant.name}
              />
            </div>

            <div className="pt-3 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSaveSecurity} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Security & Password
            </h3>

            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            <div className="pt-3 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              >
                Update Password
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
