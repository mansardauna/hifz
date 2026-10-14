import React, { useState } from 'react';
import { Card, Input, Button, Badge } from '../ui';
import { ToastMessage } from '../ui/Toast';
import { useTenant } from '../../context/TenantContext';
import { PaymentGatewayConfig } from '../../types';
import {
  Key,
  ShieldCheck,
  Video,
  CreditCard,
  Database,
  Mail,
  Cpu,
  ExternalLink,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Server
} from 'lucide-react';

interface IntegrationsManagerProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const IntegrationsManager: React.FC<IntegrationsManagerProps> = ({ onAddToast }) => {
  const { tenant, updateTenantConfig } = useTenant();

  const savedIntegrations = tenant.settings?.integrations || {};
  const stripeGateway = tenant.paymentGateways?.find((g) => g.provider === 'stripe');
  const moyasarGateway = tenant.paymentGateways?.find((g) => g.provider === 'moyasar');

  // LiveKit WebRTC state
  const [livekitUrl, setLivekitUrl] = useState<string>(
    savedIntegrations.livekit?.url || 'wss://cloud.livekit.io'
  );
  const [livekitApiKey, setLivekitApiKey] = useState<string>(
    savedIntegrations.livekit?.apiKey || ''
  );
  const [livekitApiSecret, setLivekitApiSecret] = useState<string>(
    savedIntegrations.livekit?.apiSecret || ''
  );

  // Stripe state
  const [stripePubKey, setStripePubKey] = useState<string>(
    stripeGateway?.publishableKey || savedIntegrations.stripe?.publishableKey || ''
  );
  const [stripeSecretKey, setStripeSecretKey] = useState<string>(
    stripeGateway?.secretKey || savedIntegrations.stripe?.secretKey || ''
  );
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState<string>(
    stripeGateway?.webhookSecret || savedIntegrations.stripe?.webhookSecret || ''
  );

  // Moyasar state
  const [moyasarPubKey, setMoyasarPubKey] = useState<string>(
    moyasarGateway?.publishableKey || savedIntegrations.moyasar?.publishableKey || ''
  );
  const [moyasarSecretKey, setMoyasarSecretKey] = useState<string>(
    moyasarGateway?.secretKey || savedIntegrations.moyasar?.secretKey || ''
  );

  // Database state
  const [databaseUrl, setDatabaseUrl] = useState<string>(
    savedIntegrations.database?.url || 'mysql://root:@localhost:3306/zealous_hopper'
  );

  // Resend / Email state
  const [resendApiKey, setResendApiKey] = useState<string>(
    tenant.emailGatewayConfig?.apiKey || savedIntegrations.resend?.apiKey || ''
  );

  // OpenAI Whisper state
  const [openaiApiKey, setOpenaiApiKey] = useState<string>(
    savedIntegrations.openai?.apiKey || ''
  );

  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const toggleShowSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveIntegration = (serviceKey: string, serviceName: string) => {
    const updatedIntegrations = {
      ...savedIntegrations,
    };

    let updatedGateways: PaymentGatewayConfig[] = [...(tenant.paymentGateways || [])];

    if (serviceKey === 'livekit') {
      updatedIntegrations.livekit = {
        url: livekitUrl.trim(),
        apiKey: livekitApiKey.trim(),
        apiSecret: livekitApiSecret.trim(),
      };
    } else if (serviceKey === 'stripe') {
      updatedIntegrations.stripe = {
        publishableKey: stripePubKey.trim(),
        secretKey: stripeSecretKey.trim(),
        webhookSecret: stripeWebhookSecret.trim(),
      };
      // Synchronize with tenant.paymentGateways
      const existingIdx = updatedGateways.findIndex((g) => g.provider === 'stripe');
      const stripeConfig: PaymentGatewayConfig = {
        provider: 'stripe',
        enabled: Boolean(stripePubKey.trim() && stripeSecretKey.trim()),
        publishableKey: stripePubKey.trim(),
        secretKey: stripeSecretKey.trim(),
        webhookSecret: stripeWebhookSecret.trim(),
        liveMode: !stripePubKey.trim().startsWith('pk_test_'),
      };
      if (existingIdx >= 0) {
        updatedGateways[existingIdx] = stripeConfig;
      } else {
        updatedGateways.push(stripeConfig);
      }
    } else if (serviceKey === 'moyasar') {
      updatedIntegrations.moyasar = {
        publishableKey: moyasarPubKey.trim(),
        secretKey: moyasarSecretKey.trim(),
      };
      // Synchronize with tenant.paymentGateways
      const existingIdx = updatedGateways.findIndex((g) => g.provider === 'moyasar');
      const moyasarConfig: PaymentGatewayConfig = {
        provider: 'moyasar',
        enabled: Boolean(moyasarPubKey.trim() && moyasarSecretKey.trim()),
        publishableKey: moyasarPubKey.trim(),
        secretKey: moyasarSecretKey.trim(),
        liveMode: !moyasarPubKey.trim().startsWith('pk_test_'),
      };
      if (existingIdx >= 0) {
        updatedGateways[existingIdx] = moyasarConfig;
      } else {
        updatedGateways.push(moyasarConfig);
      }
    } else if (serviceKey === 'database') {
      updatedIntegrations.database = {
        url: databaseUrl.trim(),
      };
    } else if (serviceKey === 'resend') {
      updatedIntegrations.resend = {
        apiKey: resendApiKey.trim(),
      };
      // Also update email gateway config
      updateTenantConfig({
        emailGatewayConfig: {
          enabled: Boolean(resendApiKey.trim()),
          provider: 'resend',
          apiKey: resendApiKey.trim(),
          fromEmail: tenant.emailGatewayConfig?.fromEmail || tenant.contactEmail,
          fromName: tenant.emailGatewayConfig?.fromName || tenant.name,
        },
      });
    } else if (serviceKey === 'openai') {
      updatedIntegrations.openai = {
        apiKey: openaiApiKey.trim(),
      };
    }

    updateTenantConfig({
      paymentGateways: updatedGateways,
      settings: {
        ...(tenant.settings as any),
        integrations: updatedIntegrations,
      },
    });

    onAddToast({
      type: 'success',
      title: `${serviceName} Saved`,
      message: `${serviceName} API credentials saved and connected to academy configuration.`,
    });
  };

  const isLivekitConnected = Boolean(livekitApiKey.trim() && livekitApiSecret.trim());
  const isStripeConnected = Boolean(stripePubKey.trim() && stripeSecretKey.trim());
  const isMoyasarConnected = Boolean(moyasarPubKey.trim() && moyasarSecretKey.trim());
  const isDatabaseConnected = Boolean(databaseUrl.trim());
  const isResendConnected = Boolean(resendApiKey.trim());
  const isOpenaiConnected = Boolean(openaiApiKey.trim());

  return (
    <div className="space-y-6 font-sans">
      {/* Intro Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <h2 className="text-xl font-semibold">API Keys & Live Integrations</h2>
          </div>
          <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Connect live infrastructure services and payment processors. Enter your API credentials from each provider below to activate live processing.
          </p>
        </div>

        <Badge variant={isLivekitConnected && isStripeConnected ? 'success' : 'default'}>
          {isLivekitConnected && isStripeConnected ? 'Core Services Connected' : 'Credentials Hub'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. LiveKit Video Classroom & WebRTC */}
        <Card className="p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Video className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">LiveKit Cloud (WebRTC SFU)</h3>
                <p className="text-[11px] text-slate-500">Live 1-on-1 & Group HD video classroom rooms</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isLivekitConnected ? 'success' : 'default'}>
                {isLivekitConnected ? 'Connected' : 'Not Connected'}
              </Badge>
              <a
                href="https://cloud.livekit.io"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Get Keys</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              label="LiveKit Server URL"
              value={livekitUrl}
              onChange={(e) => setLivekitUrl(e.target.value)}
              placeholder="wss://your-project.livekit.cloud"
            />
            <Input
              label="LiveKit API Key"
              value={livekitApiKey}
              onChange={(e) => setLivekitApiKey(e.target.value)}
              placeholder="APIxxxxxxxxxxxx"
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">LiveKit API Secret</label>
              <div className="relative">
                <input
                  type={showSecrets['livekit'] ? 'text' : 'password'}
                  value={livekitApiSecret}
                  onChange={(e) => setLivekitApiSecret(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg pr-10 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={() => toggleShowSecret('livekit')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showSecrets['livekit'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary" onClick={() => handleSaveIntegration('livekit', 'LiveKit Video')}>
              Save
            </Button>
          </div>
        </Card>

        {/* 2. Stripe Global Payments */}
        <Card className="p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-indigo-600 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Stripe Payments & Subscriptions</h3>
                <p className="text-[11px] text-slate-500">Credit cards, Apple Pay, and automated tuition</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isStripeConnected ? 'success' : 'default'}>
                {isStripeConnected ? 'Connected' : 'Not Connected'}
              </Badge>
              <a
                href="https://dashboard.stripe.com/apikeys"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              label="Stripe Publishable Key"
              value={stripePubKey}
              onChange={(e) => setStripePubKey(e.target.value)}
              placeholder="pk_live_..."
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stripe Secret Key</label>
              <div className="relative">
                <input
                  type={showSecrets['stripe'] ? 'text' : 'password'}
                  value={stripeSecretKey}
                  onChange={(e) => setStripeSecretKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg pr-10 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={() => toggleShowSecret('stripe')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showSecrets['stripe'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Input
              label="Webhook Signing Secret"
              value={stripeWebhookSecret}
              onChange={(e) => setStripeWebhookSecret(e.target.value)}
              placeholder="whsec_..."
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary" onClick={() => handleSaveIntegration('stripe', 'Stripe')}>
              Save
            </Button>
          </div>
        </Card>

        {/* 3. Moyasar Saudi Payments (Mada & Apple Pay) */}
        <Card className="p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Moyasar Gateway (Mada / GCC)</h3>
                <p className="text-[11px] text-slate-500">Saudi local debit cards & Apple Pay</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isMoyasarConnected ? 'success' : 'default'}>
                {isMoyasarConnected ? 'Connected' : 'Not Connected'}
              </Badge>
              <a
                href="https://dashboard.moyasar.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <span>Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              label="Moyasar Publishable Key"
              value={moyasarPubKey}
              onChange={(e) => setMoyasarPubKey(e.target.value)}
              placeholder="pk_live_..."
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Moyasar Secret Key</label>
              <div className="relative">
                <input
                  type={showSecrets['moyasar'] ? 'text' : 'password'}
                  value={moyasarSecretKey}
                  onChange={(e) => setMoyasarSecretKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg pr-10 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={() => toggleShowSecret('moyasar')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showSecrets['moyasar'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary" onClick={() => handleSaveIntegration('moyasar', 'Moyasar')}>
              Save
            </Button>
          </div>
        </Card>

        {/* 4. PostgreSQL Database Persistence */}
        <Card className="p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-purple-600 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Database Connection</h3>
                <p className="text-[11px] text-slate-500">Persistent database connection string</p>
              </div>
            </div>
            <Badge variant={isDatabaseConnected ? 'success' : 'default'}>
              {isDatabaseConnected ? 'Configured' : 'Default'}
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">DATABASE_URL Connection String</label>
              <div className="relative">
                <input
                  type={showSecrets['database'] ? 'text' : 'password'}
                  value={databaseUrl}
                  onChange={(e) => setDatabaseUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg pr-10 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={() => toggleShowSecret('database')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showSecrets['database'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary" onClick={() => handleSaveIntegration('database', 'Database')}>
              Save
            </Button>
          </div>
        </Card>

        {/* 5. Resend / Transactional Email */}
        <Card className="p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-sky-600 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Resend (Transactional Emails)</h3>
                <p className="text-[11px] text-slate-500">Student enrollment emails & receipts</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isResendConnected ? 'success' : 'default'}>
                {isResendConnected ? 'Connected' : 'Not Connected'}
              </Badge>
              <a
                href="https://resend.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1"
              >
                <span>Resend.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              label="Resend API Key"
              value={resendApiKey}
              onChange={(e) => setResendApiKey(e.target.value)}
              placeholder="re_..."
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary" onClick={() => handleSaveIntegration('resend', 'Resend Email')}>
              Save
            </Button>
          </div>
        </Card>

        {/* 6. OpenAI Whisper AI */}
        <Card className="p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">OpenAI API (Speech & AI)</h3>
                <p className="text-[11px] text-slate-500">Recitation audio analysis & AI assistance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isOpenaiConnected ? 'success' : 'default'}>
                {isOpenaiConnected ? 'Connected' : 'Not Connected'}
              </Badge>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-1"
              >
                <span>OpenAI Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">OpenAI API Key</label>
              <div className="relative">
                <input
                  type={showSecrets['openai'] ? 'text' : 'password'}
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg pr-10 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={() => toggleShowSecret('openai')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showSecrets['openai'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary" onClick={() => handleSaveIntegration('openai', 'OpenAI')}>
              Save
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
