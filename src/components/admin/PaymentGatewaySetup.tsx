import React, { useState } from 'react';
import { PaymentGatewayConfig } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Button, Input, Card, Badge } from '../ui';
import { CreditCard, Building2, Save } from 'lucide-react';

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
      title: 'Payment Settings Saved',
      message: 'Gateway credentials and merchant configuration updated.',
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
      {/* Header Card */}
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Payment Gateways</h2>
          <p className="text-xs text-slate-500 mt-0.5">Connect merchant accounts to collect tuition fees directly from enrolled students.</p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Credentials
        </Button>
      </Card>

      {/* Gateway Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stripe */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">Stripe Connect</h3>
                  <p className="text-[11px] text-slate-500">Credit / Debit Cards</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={stripe.enabled}
                onChange={() => handleToggle('stripe')}
                className="w-4 h-4 text-slate-900 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <Input
                label="Publishable Key"
                type="text"
                value={stripe.publishableKey || ''}
                onChange={(e) => handleUpdate('stripe', { publishableKey: e.target.value })}
                placeholder="pk_live_..."
              />

              <Input
                label="Secret Key"
                type="password"
                value={stripe.secretKey || ''}
                onChange={(e) => handleUpdate('stripe', { secretKey: e.target.value })}
                placeholder="sk_live_..."
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Mode:</span>
            <Badge variant="success">Live Production</Badge>
          </div>
        </Card>

        {/* Moyasar */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">Moyasar Gateway</h3>
                  <p className="text-[11px] text-slate-500">Mada, Apple Pay, STC Pay</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={moyasar.enabled}
                onChange={() => handleToggle('moyasar')}
                className="w-4 h-4 text-slate-900 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <Input
                label="Moyasar API Key"
                type="text"
                value={moyasar.publishableKey || ''}
                onChange={(e) => handleUpdate('moyasar', { publishableKey: e.target.value })}
                placeholder="pk_live_moyasar_..."
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Supported:</span>
            <span className="font-bold text-slate-800">SAR, AED, KWD, USD</span>
          </div>
        </Card>

        {/* Bank Wire */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">Direct Bank Wire</h3>
                  <p className="text-[11px] text-slate-500">IBAN & Wire Receipts</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={bank.enabled}
                onChange={() => handleToggle('bank_transfer')}
                className="w-4 h-4 text-slate-900 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <Input
                label="Bank Name"
                type="text"
                value={bank.bankDetails?.bankName || ''}
                onChange={(e) =>
                  handleUpdate('bank_transfer', {
                    bankDetails: { ...bank.bankDetails!, bankName: e.target.value },
                  })
                }
                placeholder="e.g. Chase / Al Rajhi"
              />

              <Input
                label="IBAN / Account Number"
                type="text"
                value={bank.bankDetails?.iban || ''}
                onChange={(e) =>
                  handleUpdate('bank_transfer', {
                    bankDetails: { ...bank.bankDetails!, iban: e.target.value },
                  })
                }
                placeholder="SA448000..."
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Payment receipts are submitted directly to the Admissions CRM.
          </div>
        </Card>
      </div>
    </form>
  );
};
