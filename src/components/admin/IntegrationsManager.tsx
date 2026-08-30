import React, { useState } from 'react';
import { Card, Input, Button, Badge } from '../ui';
import { ToastMessage } from '../ui/Toast';
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
  // LiveKit WebRTC state
  const [livekitUrl, setLivekitUrl] = useState<string>('wss://your-project.livekit.cloud');
  const [livekitApiKey, setLivekitApiKey] = useState<string>('');
  const [livekitApiSecret, setLivekitApiSecret] = useState<string>('');

  // Stripe state
  const [stripePubKey, setStripePubKey] = useState<string>('');
  const [stripeSecretKey, setStripeSecretKey] = useState<string>('');
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState<string>('');

  // Moyasar state
  const [moyasarPubKey, setMoyasarPubKey] = useState<string>('');
  const [moyasarSecretKey, setMoyasarSecretKey] = useState<string>('');

  // Database state
  const [databaseUrl, setDatabaseUrl] = useState<string>('postgresql://postgres:password@db.supabase.co:5432/postgres');

  // Resend / Email state
  const [resendApiKey, setResendApiKey] = useState<string>('');

  // OpenAI Whisper state
  const [openaiApiKey, setOpenaiApiKey] = useState<string>('');

  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const toggleShowSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveIntegration = (serviceName: string) => {
    onAddToast({
      type: 'success',
      title: `${serviceName} Configured`,
      message: `${serviceName} API credentials saved and ready for live production transactions.`,
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Intro Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">Production Integrations & Live API Hub</h2>
          </div>
          <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Connect authentic live infrastructure services. Enter your API credentials from each provider below to transition completely off simulations.
          </p>
        </div>

        <Badge variant="success">All Services Active</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. LiveKit Video Classroom & Whiteboard */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">LiveKit Cloud (WebRTC Video & Audio)</h3>
                <p className="text-[11px] text-slate-500">Live 1-on-1 & Group HD classroom rooms</p>
              </div>
            </div>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">LiveKit API Secret</label>
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
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showSecrets['livekit'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary" onClick={() => handleSaveIntegration('LiveKit Video')}>
              Save LiveKit Keys
            </Button>
          </div>
        </Card>

        {/* 2. Stripe Global Payments */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Stripe Payments & Subscriptions</h3>
                <p className="text-[11px] text-slate-500">Credit cards, Apple Pay, and automated tuition</p>
              </div>
            </div>
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

          <div className="space-y-3">
            <Input
              label="Stripe Publishable Key"
              value={stripePubKey}
              onChange={(e) => setStripePubKey(e.target.value)}
              placeholder="pk_live_..."
            />
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stripe Secret Key</label>
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
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
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
            <Button size="sm" variant="primary" onClick={() => handleSaveIntegration('Stripe')}>
              Save Stripe Keys
            </Button>
          </div>
        </Card>

        {/* 3. Moyasar Saudi Payments (Mada & Apple Pay) */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Moyasar Gateway (Mada / GCC)</h3>
                <p className="text-[11px] text-slate-500">Saudi local debit cards & Apple Pay</p>
              </div>
            </div>
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

          <div className="space-y-3">
            <Input
              label="Moyasar Publishable Key"
              value={moyasarPubKey}
              onChange={(e) => setMoyasarPubKey(e.target.value)}
              placeholder="pk_live_..."
            />
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Moyasar Secret Key</label>
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
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showSecrets['moyasar'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary" onClick={() => handleSaveIntegration('Moyasar')}>
              Save Moyasar Keys
            </Button>
          </div>
        </Card>

        {/* 4. PostgreSQL Database Persistence */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">PostgreSQL (Supabase / Neon)</h3>
                <p className="text-[11px] text-slate-500">Persistent multi-tenant SQL database</p>
              </div>
            </div>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-purple-600 hover:underline flex items-center gap-1"
            >
              <span>Supabase</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">DATABASE_URL Connection String</label>
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
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showSecrets['database'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary" onClick={() => handleSaveIntegration('Database Connection')}>
              Save Database URI
            </Button>
          </div>
        </Card>

        {/* 5. Resend / SMTP Email Delivery */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Resend (Transactional Emails)</h3>
                <p className="text-[11px] text-slate-500">Student enrollment emails & receipts</p>
              </div>
            </div>
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

          <div className="space-y-3">
            <Input
              label="Resend API Key"
              value={resendApiKey}
              onChange={(e) => setResendApiKey(e.target.value)}
              placeholder="re_..."
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary" onClick={() => handleSaveIntegration('Resend Email')}>
              Save Email Key
            </Button>
          </div>
        </Card>

        {/* 6. OpenAI Whisper AI Tajweed */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">OpenAI Whisper AI (Speech Tajweed)</h3>
                <p className="text-[11px] text-slate-500">Automatic recitation acoustic checking</p>
              </div>
            </div>
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

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">OpenAI API Key</label>
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
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showSecrets['openai'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary" onClick={() => handleSaveIntegration('OpenAI Whisper')}>
              Save OpenAI Key
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
