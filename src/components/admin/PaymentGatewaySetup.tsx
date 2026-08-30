import React, { useState } from 'react';
import { PaymentGatewayConfig } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Button, Input, Card, Badge } from '../ui';
import { CreditCard, Building2, Save, Globe, Landmark, ShieldCheck } from 'lucide-react';

interface PaymentGatewaySetupProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const PaymentGatewaySetup: React.FC<PaymentGatewaySetupProps> = ({ onAddToast }) => {
  const { tenant } = useTenant();
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>(tenant.paymentGateways || []);

  const handleToggle = (provider: string) => {
    setGateways((prev) => {
      const exists = prev.find((gw) => gw.provider === provider);
      if (exists) {
        return prev.map((gw) => (gw.provider === provider ? { ...gw, enabled: !gw.enabled } : gw));
      }
      return [...prev, { provider: provider as any, enabled: true, liveMode: true }];
    });
  };

  const handleUpdate = (provider: string, updates: Partial<PaymentGatewayConfig>) => {
    setGateways((prev) => {
      const exists = prev.find((gw) => gw.provider === provider);
      if (exists) {
        return prev.map((gw) => (gw.provider === provider ? { ...gw, ...updates } : gw));
      }
      return [...prev, { provider: provider as any, enabled: true, liveMode: true, ...updates }];
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToast({
      type: 'success',
      title: 'Merchant Gateways Saved',
      message: 'Tuition payment settings and API credentials updated for your academy.',
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

  const flutterwave = gateways.find((g) => g.provider === 'flutterwave') || {
    provider: 'flutterwave' as const,
    enabled: false,
    publishableKey: '',
    secretKey: '',
    liveMode: true,
  };

  const paystack = gateways.find((g) => g.provider === 'paystack') || {
    provider: 'paystack' as const,
    enabled: false,
    publishableKey: '',
    secretKey: '',
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
          <h2 className="text-base font-bold text-slate-900">Academy Tuition Payment Gateways</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect your own merchant gateway accounts (Flutterwave, Paystack, Stripe, Moyasar) to collect student tuition directly into your academy's bank account.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Merchant Credentials
        </Button>
      </Card>

      {/* Gateway Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Flutterwave */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">Flutterwave</h3>
                  <p className="text-[11px] text-slate-500">African & Global Multi-Currency</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={flutterwave.enabled}
                onChange={() => handleToggle('flutterwave')}
                className="rounded border-slate-300 text-slate-900 focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </div>

            {flutterwave.enabled ? (
              <div className="space-y-3">
                <Input
                  label="Public Key (FLWPUBK)"
                  placeholder="FLWPUBK_TEST-xxxxxxxx-X"
                  value={flutterwave.publishableKey || ''}
                  onChange={(e) => handleUpdate('flutterwave', { publishableKey: e.target.value })}
                />
                <Input
                  label="Secret Key (FLWSECK)"
                  type="password"
                  placeholder="FLWSECK_TEST-xxxxxxxx-X"
                  value={flutterwave.secretKey || ''}
                  onChange={(e) => handleUpdate('flutterwave', { secretKey: e.target.value })}
                />
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="flw-live"
                    checked={flutterwave.liveMode}
                    onChange={(e) => handleUpdate('flutterwave', { liveMode: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                  />
                  <label htmlFor="flw-live" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Live Production Mode
                  </label>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-6 text-center">Enable to accept NGN, USD, GBP, KES & Mobile Money.</p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Direct to your Bank</span>
            <Badge variant={flutterwave.enabled ? 'success' : 'default'}>
              {flutterwave.enabled ? 'Active' : 'Disabled'}
            </Badge>
          </div>
        </Card>

        {/* Paystack */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">Paystack</h3>
                  <p className="text-[11px] text-slate-500">Cards, Apple Pay & Bank Transfers</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={paystack.enabled}
                onChange={() => handleToggle('paystack')}
                className="rounded border-slate-300 text-slate-900 focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </div>

            {paystack.enabled ? (
              <div className="space-y-3">
                <Input
                  label="Public Key (pk_)"
                  placeholder="pk_live_xxxxxxxxxxxxxxxx"
                  value={paystack.publishableKey || ''}
                  onChange={(e) => handleUpdate('paystack', { publishableKey: e.target.value })}
                />
                <Input
                  label="Secret Key (sk_)"
                  type="password"
                  placeholder="sk_live_xxxxxxxxxxxxxxxx"
                  value={paystack.secretKey || ''}
                  onChange={(e) => handleUpdate('paystack', { secretKey: e.target.value })}
                />
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="paystack-live"
                    checked={paystack.liveMode}
                    onChange={(e) => handleUpdate('paystack', { liveMode: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                  />
                  <label htmlFor="paystack-live" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Live Production Mode
                  </label>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-6 text-center">Enable to accept fast payments in Nigeria, Ghana, Kenya & SA.</p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Direct to your Bank</span>
            <Badge variant={paystack.enabled ? 'success' : 'default'}>
              {paystack.enabled ? 'Active' : 'Disabled'}
            </Badge>
          </div>
        </Card>

        {/* Stripe Academy Account */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">Stripe (Academy Account)</h3>
                  <p className="text-[11px] text-slate-500">Global Credit / Debit Cards</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={stripe.enabled}
                onChange={() => handleToggle('stripe')}
                className="rounded border-slate-300 text-slate-900 focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </div>

            {stripe.enabled ? (
              <div className="space-y-3">
                <Input
                  label="Publishable Key (pk_)"
                  placeholder="pk_live_..."
                  value={stripe.publishableKey || ''}
                  onChange={(e) => handleUpdate('stripe', { publishableKey: e.target.value })}
                />
                <Input
                  label="Secret Key (sk_)"
                  type="password"
                  placeholder="sk_live_..."
                  value={stripe.secretKey || ''}
                  onChange={(e) => handleUpdate('stripe', { secretKey: e.target.value })}
                />
                <Input
                  label="Webhook Secret (whsec_)"
                  type="password"
                  placeholder="whsec_..."
                  value={stripe.webhookSecret || ''}
                  onChange={(e) => handleUpdate('stripe', { webhookSecret: e.target.value })}
                />
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-6 text-center">Enable to accept payments into your academy's Stripe.</p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Direct to your Bank</span>
            <Badge variant={stripe.enabled ? 'success' : 'default'}>
              {stripe.enabled ? 'Active' : 'Disabled'}
            </Badge>
          </div>
        </Card>

        {/* Moyasar */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">Moyasar (GCC / Saudi)</h3>
                  <p className="text-[11px] text-slate-500">Mada Cards & Apple Pay (SAR)</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={moyasar.enabled}
                onChange={() => handleToggle('moyasar')}
                className="rounded border-slate-300 text-slate-900 focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </div>

            {moyasar.enabled ? (
              <div className="space-y-3">
                <Input
                  label="Publishable Key (pk_)"
                  placeholder="pk_live_..."
                  value={moyasar.publishableKey || ''}
                  onChange={(e) => handleUpdate('moyasar', { publishableKey: e.target.value })}
                />
                <Input
                  label="Secret Key (sk_)"
                  type="password"
                  placeholder="sk_live_..."
                  value={moyasar.secretKey || ''}
                  onChange={(e) => handleUpdate('moyasar', { secretKey: e.target.value })}
                />
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-6 text-center">Enable to accept Saudi Mada and GCC bank cards.</p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Direct to your Bank</span>
            <Badge variant={moyasar.enabled ? 'success' : 'default'}>
              {moyasar.enabled ? 'Active' : 'Disabled'}
            </Badge>
          </div>
        </Card>

        {/* Bank Wire / IBAN */}
        <Card className="space-y-4 flex flex-col justify-between md:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">Direct Bank Wire / IBAN</h3>
                  <p className="text-[11px] text-slate-500">Provide bank account details for manual tuition transfers</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={bank.enabled}
                onChange={() => handleToggle('bank_transfer')}
                className="rounded border-slate-300 text-slate-900 focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </div>

            {bank.enabled ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Bank Name"
                  placeholder="e.g. Al Rajhi Bank / Chase / Standard Bank"
                  value={bank.bankDetails?.bankName || ''}
                  onChange={(e) =>
                    handleUpdate('bank_transfer', {
                      bankDetails: { ...(bank.bankDetails as any), bankName: e.target.value },
                    })
                  }
                />
                <Input
                  label="Account Holder Name"
                  placeholder="e.g. Dar Al-Quran Academy LLC"
                  value={bank.bankDetails?.accountName || ''}
                  onChange={(e) =>
                    handleUpdate('bank_transfer', {
                      bankDetails: { ...(bank.bankDetails as any), accountName: e.target.value },
                    })
                  }
                />
                <Input
                  label="IBAN / Account Number"
                  placeholder="SA0380000000608010167519"
                  value={bank.bankDetails?.iban || ''}
                  onChange={(e) =>
                    handleUpdate('bank_transfer', {
                      bankDetails: { ...(bank.bankDetails as any), iban: e.target.value },
                    })
                  }
                />
                <Input
                  label="SWIFT / BIC Code"
                  placeholder="RJHIXXXX"
                  value={bank.bankDetails?.swiftCode || ''}
                  onChange={(e) =>
                    handleUpdate('bank_transfer', {
                      bankDetails: { ...(bank.bankDetails as any), swiftCode: e.target.value },
                    })
                  }
                />
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-6 text-center">Enable to display wire transfer instructions on student invoices.</p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Offline Transfers</span>
            <Badge variant={bank.enabled ? 'success' : 'default'}>
              {bank.enabled ? 'Active' : 'Disabled'}
            </Badge>
          </div>
        </Card>
      </div>
    </form>
  );
};
