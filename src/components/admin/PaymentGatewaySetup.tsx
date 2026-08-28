import React, { useState } from 'react';
import { PaymentGatewayConfig } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, Building2, Save, ArrowRight } from 'lucide-react';

interface PaymentGatewaySetupProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const PaymentGatewaySetup: React.FC<PaymentGatewaySetupProps> = ({ onAddToast }) => {
  const { tenant } = useTenant();
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>(tenant.paymentGateways || []);

  const handleToggle = (provider: string) => {
    setGateways((prev) =>
      prev.map((gw) => (gw.provider === provider ? { ...gw, enabled: !gw.enabled } : gw))
    );
  };

  const handleUpdate = (provider: string, updates: Partial<PaymentGatewayConfig>) => {
    setGateways((prev) =>
      prev.map((gw) => (gw.provider === provider ? { ...gw, ...updates } : gw))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToast({
      type: 'success',
      title: 'Payment Gateways Saved',
      message: 'Tuition payment methods and API credentials updated.',
    });
  };

  const stripe = gateways.find((g) => g.provider === 'stripe') || {
    provider: 'stripe' as const,
    enabled: false,
    publishableKey: '',
    secretKey: '',
    webhookSecret: '',
    liveMode: true,
  };

  const moyasar = gateways.find((g) => g.provider === 'moyasar') || {
    provider: 'moyasar' as const,
    enabled: false,
    publishableKey: '',
    secretKey: '',
    liveMode: true,
  };

  const bank = gateways.find((g) => g.provider === 'bank_transfer') || {
    provider: 'bank_transfer' as const,
    enabled: false,
    bankDetails: {
      bankName: '',
      accountName: '',
      iban: '',
      swiftCode: '',
    },
    liveMode: true,
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Payment Gateway Setup</h2>
          <p className="text-xs text-slate-500 mt-1">Connect your merchant account to directly collect monthly student tuition, fees, and Ijazah subscriptions.</p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-sm shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Credentials</span>
        </button>
      </div>

      {/* Gateway Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stripe */}
        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-sm bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  S
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Stripe Connect</h3>
                  <p className="text-[11px] text-slate-500">Global Credit Cards & Debit</p>
                </div>
              </div>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={stripe.enabled}
                  onChange={() => handleToggle('stripe')}
                  className="w-4 h-4 text-teal-600 rounded-sm"
                />
              </label>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Publishable Key</label>
                <input
                  type="text"
                  value={stripe.publishableKey || ''}
                  onChange={(e) => handleUpdate('stripe', { publishableKey: e.target.value })}
                  placeholder="pk_live_..."
                  className="w-full p-2.5 border border-slate-300 rounded-sm font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Secret Key</label>
                <input
                  type="password"
                  value={stripe.secretKey || ''}
                  onChange={(e) => handleUpdate('stripe', { secretKey: e.target.value })}
                  placeholder="sk_live_..."
                  className="w-full p-2.5 border border-slate-300 rounded-sm font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Mode:</span>
            <span className="font-bold text-emerald-700">Live Production</span>
          </div>
        </div>

        {/* Moyasar */}
        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-sm bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  M
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Moyasar (GCC & Mada)</h3>
                  <p className="text-[11px] text-slate-500">Mada, Apple Pay & STC Pay</p>
                </div>
              </div>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={moyasar.enabled}
                  onChange={() => handleToggle('moyasar')}
                  className="w-4 h-4 text-teal-600 rounded-sm"
                />
              </label>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Moyasar API Key</label>
                <input
                  type="text"
                  value={moyasar.publishableKey || ''}
                  onChange={(e) => handleUpdate('moyasar', { publishableKey: e.target.value })}
                  placeholder="pk_live_moyasar_..."
                  className="w-full p-2.5 border border-slate-300 rounded-sm font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Supported:</span>
            <span className="font-bold text-slate-800">SAR, AED, KWD, USD</span>
          </div>
        </div>

        {/* Bank Wire Transfer */}
        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-sm bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Manual Bank Wire</h3>
                  <p className="text-[11px] text-slate-500">Direct IBAN & Wire Receipts</p>
                </div>
              </div>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={bank.enabled}
                  onChange={() => handleToggle('bank_transfer')}
                  className="w-4 h-4 text-teal-600 rounded-sm"
                />
              </label>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bank.bankDetails?.bankName || ''}
                  onChange={(e) =>
                    handleUpdate('bank_transfer', {
                      bankDetails: { ...bank.bankDetails!, bankName: e.target.value },
                    })
                  }
                  placeholder="e.g. Al Rajhi Bank"
                  className="w-full p-2.5 border border-slate-300 rounded-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">IBAN Number</label>
                <input
                  type="text"
                  value={bank.bankDetails?.iban || ''}
                  onChange={(e) =>
                    handleUpdate('bank_transfer', {
                      bankDetails: { ...bank.bankDetails!, iban: e.target.value },
                    })
                  }
                  placeholder="SA448000..."
                  className="w-full p-2.5 border border-slate-300 rounded-sm font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Receipts uploaded by students will appear in CRM for manual verification.
          </div>
        </div>
      </div>
    </form>
  );
};
