'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Database,
  ShieldCheck,
  CreditCard,
  Mail,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Lock,
  Layers,
  AlertCircle,
  Server,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';

export function SetupWizardClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDbTesting, setIsDbTesting] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string } | null>(null);

  // Engine selection: mysql | postgres | supabase
  const [databaseType, setDatabaseType] = useState<'mysql' | 'postgres' | 'supabase'>('mysql');

  // MySQL state
  const [mysqlHost, setMysqlHost] = useState('localhost');
  const [mysqlPort, setMysqlPort] = useState(3306);
  const [mysqlDatabase, setMysqlDatabase] = useState('ankabit_lms');
  const [mysqlUser, setMysqlUser] = useState('root');
  const [mysqlPassword, setMysqlPassword] = useState('');

  // Postgres state
  const [postgresHost, setPostgresHost] = useState('localhost');
  const [postgresPort, setPostgresPort] = useState(5432);
  const [postgresDb, setPostgresDb] = useState('ankabit_lms');
  const [postgresUser, setPostgresUser] = useState('postgres');
  const [postgresPassword, setPostgresPassword] = useState('');

  // Supabase state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [supabaseServiceRoleKey, setSupabaseServiceRoleKey] = useState('');

  // Super Admin state
  const [platformName, setPlatformName] = useState('Ankabit LMS');
  const [superAdminName, setSuperAdminName] = useState('Super Administrator');
  const [superAdminEmail, setSuperAdminEmail] = useState('');
  const [superAdminPassword, setSuperAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Gateways & Email state
  const [stripePublicKey, setStripePublicKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [moyasarPublishableKey, setMoyasarPublishableKey] = useState('');
  const [moyasarSecretKey, setMoyasarSecretKey] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');
  const [fromEmail, setFromEmail] = useState('noreply@ankabit.com');
  const [currency, setCurrency] = useState('USD');

  const [errorMessage, setErrorMessage] = useState('');

  // Run live database connection check
  const runDatabaseCheck = async (): Promise<boolean> => {
    setIsDbTesting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/setup/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          databaseType,
          mysql: {
            host: mysqlHost,
            port: Number(mysqlPort),
            database: mysqlDatabase,
            user: mysqlUser,
            password: mysqlPassword,
          },
          postgres: {
            host: postgresHost,
            port: Number(postgresPort),
            database: postgresDb,
            user: postgresUser,
            password: postgresPassword,
          },
          supabase: {
            url: supabaseUrl,
            anonKey: supabaseAnonKey,
            serviceRoleKey: supabaseServiceRoleKey,
          },
        }),
      });

      const data = await res.json();
      const connected = Boolean(data.connected);

      setDbStatus({
        connected,
        message: connected
          ? data.message || `${databaseType.toUpperCase()} database connection verified clean!`
          : data.error || 'Database connection check failed. Please verify credentials.',
      });
      return connected;
    } catch (_e) {
      setDbStatus({ connected: false, message: 'Unable to test database connection endpoint.' });
      return false;
    } finally {
      setIsDbTesting(false);
    }
  };

  const handleSelectDatabaseType = (type: 'mysql' | 'postgres' | 'supabase') => {
    setDatabaseType(type);
    setDbStatus(null);
  };

  const handleContinue = async () => {
    setErrorMessage('');
    if (currentStep === 1) {
      if (!dbStatus?.connected) {
        const ok = await runDatabaseCheck();
        if (!ok) return;
      }
    }
    if (currentStep === 2) {
      if (!superAdminEmail || !superAdminPassword) {
        setErrorMessage('Super Admin Email and Password are required.');
        return;
      }
      if (superAdminPassword.length < 8) {
        setErrorMessage('Password must be at least 8 characters long.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handleCompleteSetup = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          databaseType,
          mysqlHost,
          mysqlPort,
          mysqlDatabase,
          mysqlUser,
          mysqlPassword,
          postgresHost,
          postgresPort,
          postgresDb,
          postgresUser,
          postgresPassword,
          supabaseUrl,
          supabaseAnonKey,
          supabaseServiceRoleKey,
          platformName,
          superAdminName,
          superAdminEmail,
          superAdminPassword,
          stripePublicKey,
          stripeSecretKey,
          moyasarPublishableKey,
          moyasarSecretKey,
          resendApiKey,
          fromEmail,
          currency,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentStep(5);
      } else {
        setErrorMessage(data.error || 'System setup failed to complete.');
      }
    } catch (_e) {
      setErrorMessage('Network error while saving setup parameters.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Database Engine', icon: Database },
    { num: 2, title: 'SuperAdmin & Brand', icon: ShieldCheck },
    { num: 3, title: 'Gateways', icon: CreditCard },
    { num: 4, title: 'Emails & Config', icon: Mail },
    { num: 5, title: 'Launch', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-4 sm:p-8 flex flex-col justify-between">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary,#047857)] flex items-center justify-center text-white font-semibold text-lg shadow-sm">
            A
          </div>
          <div>
            <span className="font-semibold text-xl tracking-tight text-slate-900 block leading-none">
              {platformName}
            </span>
            <span className="text-xs text-[var(--color-primary,#047857)] font-semibold">
              Multi-Database Installation & Setup Wizard
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-full hidden sm:inline-block">
            Production Ready • Prisma Multi-DB
          </span>
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="max-w-5xl mx-auto w-full my-8 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Stepper Progress Bar */}
        <div className="bg-slate-50/90 border-b border-slate-200 p-4 sm:p-6 grid grid-cols-5 gap-2 sm:gap-4">
          {steps.map((s) => {
            const isActive = currentStep === s.num;
            const isDone = currentStep > s.num;
            const Icon = s.icon;

            return (
              <div
                key={s.num}
                className={`flex items-center gap-2 sm:gap-3 p-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-white shadow-xs border border-slate-200 text-slate-900'
                    : isDone
                    ? 'text-emerald-700'
                    : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs shrink-0 ${
                    isActive
                      ? 'bg-[var(--color-primary,#047857)] text-white'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="hidden sm:block min-w-0">
                  <div className="text-[10px] uppercase tracking-wider font-semibold opacity-70">
                    Step {s.num}
                  </div>
                  <div className="text-xs font-semibold truncate">{s.title}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 flex-1 space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Multi-Database Engine Selector & Connection Verification */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Configure Database Backend</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Select your database architecture. Prisma seamlessly binds to your chosen engine with pooling.
                </p>
              </div>

              {/* Engine Selection Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    id: 'mysql' as const,
                    name: 'MySQL / MariaDB',
                    desc: 'XAMPP, AWS Aurora MySQL, Google Cloud SQL, PlanetScale',
                    icon: Server,
                  },
                  {
                    id: 'postgres' as const,
                    name: 'PostgreSQL',
                    desc: 'Self-hosted Postgres, AWS RDS Postgres, Neon DB',
                    icon: Database,
                  },
                  {
                    id: 'supabase' as const,
                    name: 'Supabase',
                    desc: 'Managed PostgreSQL with API Key and connection pooling',
                    icon: Layers,
                  },
                ].map((engine) => {
                  const Icon = engine.icon;
                  const isSelected = databaseType === engine.id;

                  return (
                    <div
                      key={engine.id}
                      onClick={() => handleSelectDatabaseType(engine.id)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-2.5 ${
                        isSelected
                          ? 'border-[var(--color-primary,#047857)] bg-emerald-50/30 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? 'bg-[var(--color-primary,#047857)] text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Active Choice
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm text-slate-900">{engine.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{engine.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Connection Form */}
              <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {databaseType.toUpperCase()} Credentials
                </h4>

                {databaseType === 'mysql' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Host"
                      value={mysqlHost}
                      onChange={(e) => setMysqlHost(e.target.value)}
                      placeholder="localhost or 127.0.0.1"
                    />
                    <Input
                      label="Port"
                      type="number"
                      value={mysqlPort}
                      onChange={(e) => setMysqlPort(Number(e.target.value))}
                      placeholder="3306"
                    />
                    <Input
                      label="Database Name"
                      value={mysqlDatabase}
                      onChange={(e) => setMysqlDatabase(e.target.value)}
                      placeholder="ankabit_lms"
                    />
                    <Input
                      label="User"
                      value={mysqlUser}
                      onChange={(e) => setMysqlUser(e.target.value)}
                      placeholder="root"
                    />
                    <div className="sm:col-span-2">
                      <Input
                        label="Password"
                        type="password"
                        value={mysqlPassword}
                        onChange={(e) => setMysqlPassword(e.target.value)}
                        placeholder="Leave blank if no password (default in local XAMPP)"
                      />
                    </div>
                  </div>
                )}

                {databaseType === 'postgres' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Host"
                      value={postgresHost}
                      onChange={(e) => setPostgresHost(e.target.value)}
                      placeholder="localhost"
                    />
                    <Input
                      label="Port"
                      type="number"
                      value={postgresPort}
                      onChange={(e) => setPostgresPort(Number(e.target.value))}
                      placeholder="5432"
                    />
                    <Input
                      label="Database Name"
                      value={postgresDb}
                      onChange={(e) => setPostgresDb(e.target.value)}
                      placeholder="ankabit_lms"
                    />
                    <Input
                      label="User"
                      value={postgresUser}
                      onChange={(e) => setPostgresUser(e.target.value)}
                      placeholder="postgres"
                    />
                    <div className="sm:col-span-2">
                      <Input
                        label="Password"
                        type="password"
                        value={postgresPassword}
                        onChange={(e) => setPostgresPassword(e.target.value)}
                        placeholder="Enter PostgreSQL password..."
                      />
                    </div>
                  </div>
                )}

                {databaseType === 'supabase' && (
                  <div className="space-y-4">
                    <Input
                      label="Supabase Project URL"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://xyzcompany.supabase.co"
                    />
                    <Input
                      label="Anon / Publishable API Key"
                      value={supabaseAnonKey}
                      onChange={(e) => setSupabaseAnonKey(e.target.value)}
                      placeholder="eyJhbGciOi..."
                    />
                    <Input
                      label="Service Role API Key"
                      type="password"
                      value={supabaseServiceRoleKey}
                      onChange={(e) => setSupabaseServiceRoleKey(e.target.value)}
                      placeholder="eyJhbGciOi..."
                    />
                  </div>
                )}

                {/* Connection Test Actions & Result */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={runDatabaseCheck}
                    isLoading={isDbTesting}
                    leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isDbTesting ? 'animate-spin' : ''}`} />}
                  >
                    Test {databaseType.toUpperCase()} Connection
                  </Button>

                  {dbStatus && (
                    <div
                      className={`text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 ${
                        dbStatus.connected
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {dbStatus.connected ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{dbStatus.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Super Admin & Brand */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Super Administrator & Platform Brand</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Create your master administrative credentials. This account controls all tenants, pricing, and infrastructure.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Platform Name"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  placeholder="Ankabit LMS"
                />
                <Input
                  label="Super Admin Name"
                  value={superAdminName}
                  onChange={(e) => setSuperAdminName(e.target.value)}
                  placeholder="Master Administrator"
                />
                <Input
                  label="Super Admin Email"
                  type="email"
                  required
                  value={superAdminEmail}
                  onChange={(e) => setSuperAdminEmail(e.target.value)}
                  placeholder="admin@ankabit.com"
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-800">
                    Super Admin Password (min 8 chars)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={superAdminPassword}
                      onChange={(e) => setSuperAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-12 px-5 py-3 text-sm font-medium bg-white text-slate-900 border border-slate-200 rounded-xl outline-none focus:outline-none focus:border-[var(--color-primary,#047857)] focus:ring-2 focus:ring-[var(--color-primary,#047857)]/20 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Gateways */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Payment Gateways (Optional)</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Configure platform-level payment gateways. You can also configure them later in the SuperAdmin dashboard.
                </p>
              </div>

              <div className="space-y-4">
                <Card className="p-5 space-y-4">
                  <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[var(--color-primary,#047857)]" />
                    <span>Stripe (International Cards)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Stripe Publishable Key"
                      value={stripePublicKey}
                      onChange={(e) => setStripePublicKey(e.target.value)}
                      placeholder="pk_test_..."
                    />
                    <Input
                      label="Stripe Secret Key"
                      type="password"
                      value={stripeSecretKey}
                      onChange={(e) => setStripeSecretKey(e.target.value)}
                      placeholder="sk_test_..."
                    />
                  </div>
                </Card>

                <Card className="p-5 space-y-4">
                  <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Moyasar (Mada & Apple Pay for GCC)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Moyasar Publishable Key"
                      value={moyasarPublishableKey}
                      onChange={(e) => setMoyasarPublishableKey(e.target.value)}
                      placeholder="pk_live_... or pk_test_..."
                    />
                    <Input
                      label="Moyasar Secret Key"
                      type="password"
                      value={moyasarSecretKey}
                      onChange={(e) => setMoyasarSecretKey(e.target.value)}
                      placeholder="sk_live_... or sk_test_..."
                    />
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* STEP 4: Email & Platform Settings */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Emails & Platform Currency</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Configure notification dispatch and base currency.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="From Email Address"
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="noreply@ankabit.com"
                />
                <Input
                  label="Platform Base Currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                  placeholder="USD, SAR, AED, or EUR"
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Resend API Key"
                    type="password"
                    value={resendApiKey}
                    onChange={(e) => setResendApiKey(e.target.value)}
                    placeholder="re_..."
                    helperText="Enables transactional welcome emails and parent notifications via Resend"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Finish & Launch */}
          {currentStep === 5 && (
            <div className="py-8 text-center space-y-5 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900">Installation Completed!</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Your database backend is verified and connected. The Super Admin account has been securely provisioned with full multi-tenant control.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-1.5 font-medium">
                <div><span className="text-slate-400">Database Engine:</span> <span className="font-semibold text-slate-900 capitalize">{databaseType}</span></div>
                <div><span className="text-slate-400">SuperAdmin Email:</span> <span className="font-semibold text-slate-900">{superAdminEmail}</span></div>
                <div><span className="text-slate-400">Platform:</span> <span className="font-semibold text-slate-900">{platformName}</span></div>
              </div>
              <div className="pt-2">
                <Link href="/super-admin">
                  <Button variant="primary" size="lg" className="w-full font-semibold">
                    Open SuperAdmin Control Center
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        {currentStep < 5 && (
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleContinue}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleCompleteSetup}
                isLoading={isSubmitting}
                rightIcon={<Sparkles className="w-4 h-4" />}
              >
                Finish & Deploy Platform
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
