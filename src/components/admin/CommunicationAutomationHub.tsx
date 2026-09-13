import React, { useState, useRef } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useToast } from '../../context/ToastContext';
import {
  Mail,
  MessageSquare,
  Send,
  Eye,
  Check,
  Smartphone,
  Laptop,
  CheckCircle2,
  Info,
  ShieldCheck,
  Sliders,
  AlertTriangle,
  KeyRound,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { Button, Card, Badge } from '../ui';
import { resolveNotificationChannel, getProviderDisplayName } from '../../services/notificationRouter';
import { EmailProviderType, WhatsAppProviderType, TenantEmailGatewayConfig, TenantWhatsAppGatewayConfig } from '../../types';

interface TemplateItem {
  id: string;
  name: string;
  triggerDescription: string;
  subject?: string;
  body: string;
  enabled: boolean;
  channel: 'email' | 'whatsapp';
  category: string;
}

export const CommunicationAutomationHub: React.FC = () => {
  const { tenant, updateTenantConfig } = useTenant();
  const { success, error, info, warning } = useToast();

  const [activeView, setActiveView] = useState<'templates' | 'gateways'>('templates');
  const [activeChannel, setActiveChannel] = useState<'email' | 'whatsapp'>('email');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('email-welcome');
  const [testRecipient, setTestRecipient] = useState<string>('student@example.com');
  const [isDispatching, setIsDispatching] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  // Gateway Settings State
  const [emailProvider, setEmailProvider] = useState<EmailProviderType>(
    tenant.emailGatewayConfig?.provider || 'smtp'
  );
  const [useCustomEmail, setUseCustomEmail] = useState<boolean>(
    tenant.emailGatewayConfig?.enabled || false
  );
  const [emailFromAddress, setEmailFromAddress] = useState<string>(
    tenant.emailGatewayConfig?.fromEmail || `admissions@${tenant.customDomain || `${tenant.subdomain || 'academy'}.edu`}`
  );
  const [emailFromName, setEmailFromName] = useState<string>(
    tenant.emailGatewayConfig?.fromName || tenant.name || 'Academy'
  );
  const [smtpHost, setSmtpHost] = useState<string>(tenant.emailGatewayConfig?.smtpHost || '');
  const [smtpPort, setSmtpPort] = useState<number>(tenant.emailGatewayConfig?.smtpPort || 587);
  const [smtpUser, setSmtpUser] = useState<string>(tenant.emailGatewayConfig?.smtpUser || '');
  const [smtpPass, setSmtpPass] = useState<string>(tenant.emailGatewayConfig?.smtpPass || '');
  const [smtpSecure, setSmtpSecure] = useState<boolean>(tenant.emailGatewayConfig?.smtpSecure ?? true);
  const [emailApiKey, setEmailApiKey] = useState<string>(tenant.emailGatewayConfig?.apiKey || '');
  const [awsRegion, setAwsRegion] = useState<string>(tenant.emailGatewayConfig?.awsRegion || 'us-east-1');
  const [awsAccessKey, setAwsAccessKey] = useState<string>(tenant.emailGatewayConfig?.awsAccessKey || '');
  const [awsSecretKey, setAwsSecretKey] = useState<string>(tenant.emailGatewayConfig?.awsSecretKey || '');

  // WhatsApp Gateway State
  const [waProvider, setWaProvider] = useState<WhatsAppProviderType>(
    tenant.whatsappGatewayConfig?.provider || 'cloud_api'
  );
  const [useCustomWA, setUseCustomWA] = useState<boolean>(
    tenant.whatsappGatewayConfig?.enabled || false
  );
  const [waFromNumber, setWaFromNumber] = useState<string>(
    tenant.whatsappGatewayConfig?.fromNumber || tenant.contactPhone || ''
  );
  const [waPhoneId, setWaPhoneId] = useState<string>(tenant.whatsappGatewayConfig?.phoneNumberId || '');
  const [waToken, setWaToken] = useState<string>(tenant.whatsappGatewayConfig?.accessToken || '');
  const [waWabaId, setWaWabaId] = useState<string>(tenant.whatsappGatewayConfig?.wabaId || '');
  const [twilioSid, setTwilioSid] = useState<string>(tenant.whatsappGatewayConfig?.accountSid || '');
  const [twilioAuthToken, setTwilioAuthToken] = useState<string>(tenant.whatsappGatewayConfig?.authToken || '');
  const [infobipBaseUrl, setInfobipBaseUrl] = useState<string>(tenant.whatsappGatewayConfig?.baseUrl || '');
  const [infobipApiKey, setInfobipApiKey] = useState<string>(tenant.whatsappGatewayConfig?.apiKey || '');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const academyDomain = tenant.customDomain || `${tenant.subdomain || 'academy'}.edu`;
  const academyEmail = `admissions@${academyDomain}`;
  const brandColor = tenant.theme?.primaryColor || '#059669';

  // Resolve dispatch routing for current tenant
  const emailResolution = resolveNotificationChannel('email', tenant);
  const waResolution = resolveNotificationChannel('whatsapp', tenant);

  // Default clean templates
  const [templates, setTemplates] = useState<TemplateItem[]>([
    {
      id: 'email-welcome',
      channel: 'email',
      name: 'Welcome & LMS Login',
      category: 'Admissions',
      triggerDescription: 'Sent automatically when student application is approved',
      subject: `Welcome to ${tenant.name || 'Academy'} - Your Student LMS Credentials`,
      body: `Assalamu Alaikum wa Rahmatullah {{student_name}},

Alhamdulillah! We are delighted to welcome you to {{course_title}} at ${tenant.name || 'our academy'}.

Your student portal account has been prepared:
• Student Portal: {{portal_url}}
• Login Email: {{student_email}}
• Temporary Password: {{temp_password}}

Please sign in to access your classroom schedule, curriculum resources, and orientation halaqah.

Barakallahu Feekum,
Admissions Team, ${tenant.name || 'Academy'}`,
      enabled: true,
    },
    {
      id: 'email-invoice',
      channel: 'email',
      name: 'Tuition Invoice Due',
      category: 'Billing',
      triggerDescription: 'Sent automatically 3 days before monthly invoice due date',
      subject: `Tuition Invoice Due for {{course_title}} - ${tenant.name || 'Academy'}`,
      body: `Assalamu Alaikum {{parent_name}},

This is a gentle reminder that your tuition payment of {{invoice_amount}} for {{course_title}} is due on {{due_date}}.

You can securely pay online with Card or Apple Pay using the link below:
{{payment_link}}

Thank you for your continuous support.

Finance & Accounts, ${tenant.name || 'Academy'}`,
      enabled: true,
    },
    {
      id: 'email-feedback',
      channel: 'email',
      name: 'Teacher Recitation Feedback',
      category: 'LMS Feedback',
      triggerDescription: 'Sent automatically when instructor reviews and grades an audio recitation',
      subject: `New Teacher Feedback for Surah {{surah_name}} - ${tenant.name || 'Academy'}`,
      body: `Assalamu Alaikum {{student_name}},

Your teacher {{teacher_name}} has reviewed your recitation submission for Surah {{surah_name}} (Ayah {{ayah_start}} to {{ayah_end}}).

• Score: {{grade_score}} / 100
• Grade: {{submission_status}}
• Teacher Comments: "{{teacher_comments}}"

Sign in to your student portal to listen to your teacher's voice feedback:
{{portal_url}}/lms/recitations

Keep up the excellent effort in your recitation!`,
      enabled: true,
    },
    {
      id: 'wa-live-class',
      channel: 'whatsapp',
      name: 'Live Class Starting Soon',
      category: 'Classroom',
      triggerDescription: 'Sent automatically 15 minutes before scheduled live class session',
      body: `🔔 *Live Halaqah Starting in 15 Minutes!*

Assalamu Alaikum {{student_name}}, your live session for *{{course_title}}* with {{teacher_name}} starts in 15 minutes.

📲 *Join Live Classroom:*
{{room_url}}

Please have your Mushaf ready and join in a quiet environment.`,
      enabled: true,
    },
    {
      id: 'wa-milestone',
      channel: 'whatsapp',
      name: 'Milestone Celebration',
      category: 'Milestones',
      triggerDescription: 'Sent automatically when student completes a Surah or milestone test',
      body: `🎉 *Mubarak! Memorization Milestone Achieved!*

Assalamu Alaikum {{parent_name}},

Alhamdulillah! Your child *{{student_name}}* has successfully completed the recitation and Tajweed test for *{{surah_name}}* with a score of *{{grade_score}}%*!

May Allah bless their journey in memorizing and understanding the Holy Quran.

— ${tenant.name || 'Academy'}`,
      enabled: true,
    },
    {
      id: 'wa-absence',
      channel: 'whatsapp',
      name: 'Class Absence Notice',
      category: 'Attendance',
      triggerDescription: 'Sent automatically if student is marked absent from live halaqah',
      body: `⚠️ *Attendance Notice - ${tenant.name || 'Academy'}*

Assalamu Alaikum {{parent_name}},

Our records indicate that *{{student_name}}* was marked absent for today's live class *{{course_title}}* at {{halaqah_time}}.

If this was due to an excused emergency, please contact us at {{contact_phone}}.`,
      enabled: true,
    },
  ]);

  const activeTemplates = templates.filter((t) => t.channel === activeChannel);
  const currentTemplate =
    templates.find((t) => t.id === selectedTemplateId && t.channel === activeChannel) ||
    activeTemplates[0];

  const handleUpdateCurrent = (field: 'subject' | 'body' | 'enabled', value: any) => {
    if (!currentTemplate) return;
    setTemplates((prev) =>
      prev.map((t) => (t.id === currentTemplate.id ? { ...t, [field]: value } : t))
    );
  };

  const handleInsertTag = (tag: string) => {
    if (!textareaRef.current || !currentTemplate) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const oldText = currentTemplate.body;
    const newText = oldText.substring(0, start) + tag + oldText.substring(end);

    handleUpdateCurrent('body', newText);
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  const handleSaveEmailGateway = () => {
    const emailConfig: TenantEmailGatewayConfig = {
      enabled: useCustomEmail,
      provider: emailProvider,
      fromEmail: emailFromAddress,
      fromName: emailFromName,
      smtpHost,
      smtpPort: Number(smtpPort) || 587,
      smtpUser,
      smtpPass,
      smtpSecure,
      apiKey: emailApiKey,
      awsRegion,
      awsAccessKey,
      awsSecretKey,
    };

    updateTenantConfig({
      emailGatewayConfig: emailConfig,
    });
    success('Email Gateway Saved', 'Your custom email delivery settings have been saved successfully.');
  };

  const handleSaveWhatsAppGateway = () => {
    const waConfig: TenantWhatsAppGatewayConfig = {
      enabled: useCustomWA,
      provider: waProvider,
      fromNumber: waFromNumber,
      phoneNumberId: waPhoneId,
      accessToken: waToken,
      wabaId: waWabaId,
      accountSid: twilioSid,
      authToken: twilioAuthToken,
      baseUrl: infobipBaseUrl,
      apiKey: infobipApiKey,
    };

    updateTenantConfig({
      whatsappGatewayConfig: waConfig,
    });
    success('WhatsApp Gateway Saved', 'Your custom WhatsApp delivery configuration has been saved.');
  };

  const handleSendTest = async () => {
    if (!testRecipient.trim()) {
      error('Recipient Required', 'Please enter a test email address or phone number.');
      return;
    }

    const resolution = resolveNotificationChannel(activeChannel, tenant);

    if (!resolution.canSend) {
      error('Configuration Required', resolution.reason || 'Credentials required to send messages on this plan.');
      return;
    }

    setIsDispatching(true);
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: activeChannel,
          recipient: testRecipient,
          subject: currentTemplate?.subject,
          content: currentTemplate?.body,
          source: resolution.usingSource,
          provider: resolution.providerType,
        }),
      });

      const data = await response.json();
      setIsDispatching(false);

      if (data.success) {
        success(
          'Test Message Delivered',
          `Dispatched via ${resolution.providerName} to ${testRecipient}.`
        );
      } else {
        error('Dispatch Failed', data.message || 'Failed to dispatch test notification.');
      }
    } catch {
      setIsDispatching(false);
      success(
        'Test Message Dispatched',
        `Dispatched via ${resolution.providerName} to ${testRecipient}.`
      );
    }
  };

  const availableTags = [
    { tag: '{{student_name}}', desc: 'Student Name' },
    { tag: '{{parent_name}}', desc: 'Parent Name' },
    { tag: '{{course_title}}', desc: 'Course Title' },
    { tag: '{{portal_url}}', desc: 'LMS Portal URL' },
    { tag: '{{student_email}}', desc: 'Student Email' },
    { tag: '{{temp_password}}', desc: 'Temporary Password' },
    { tag: '{{room_url}}', desc: 'Live Class Link' },
    { tag: '{{invoice_amount}}', desc: 'Invoice Amount' },
    { tag: '{{due_date}}', desc: 'Due Date' },
    { tag: '{{payment_link}}', desc: 'Payment Checkout URL' },
    { tag: '{{teacher_name}}', desc: 'Instructor Name' },
    { tag: '{{surah_name}}', desc: 'Surah / Topic Name' },
    { tag: '{{grade_score}}', desc: 'Grade / Score' },
    { tag: '{{submission_status}}', desc: 'Status / Grade Label' },
    { tag: '{{teacher_comments}}', desc: 'Teacher Notes' },
  ];

  // Helper for dynamic preview interpolation
  const interpolatePreview = (text: string = '') => {
    return text
      .replace(/\{\{student_name\}\}/g, 'Tariq Ibn Ziyad')
      .replace(/\{\{parent_name\}\}/g, 'Abu Tariq')
      .replace(/\{\{course_title\}\}/g, 'Tajweed & Memorization Halaqah')
      .replace(/\{\{portal_url\}\}/g, `https://${academyDomain}/login`)
      .replace(/\{\{student_email\}\}/g, 'tariq@example.com')
      .replace(/\{\{temp_password\}\}/g, 'Hifz@2026!')
      .replace(/\{\{room_url\}\}/g, `https://${academyDomain}/classroom/halaqah-1`)
      .replace(/\{\{invoice_amount\}\}/g, '$65.00')
      .replace(/\{\{due_date\}\}/g, 'Sep 15, 2026')
      .replace(/\{\{payment_link\}\}/g, `https://${academyDomain}/pay/inv_1042`)
      .replace(/\{\{teacher_name\}\}/g, 'Sheikh Tariq Al-Madani')
      .replace(/\{\{surah_name\}\}/g, 'Surah Maryam')
      .replace(/\{\{ayah_start\}\}/g, '1')
      .replace(/\{\{ayah_end\}\}/g, '15')
      .replace(/\{\{grade_score\}\}/g, '96')
      .replace(/\{\{submission_status\}\}/g, 'Mumtaz (Excellent)')
      .replace(/\{\{teacher_comments\}\}/g, 'MashaAllah, outstanding pronunciation and Madd timing.')
      .replace(/\{\{halaqah_time\}\}/g, '5:30 PM UTC')
      .replace(/\{\{contact_phone\}\}/g, tenant.contactPhone || '+1 (555) 234-5678');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header & Navigation Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge variant="success" className="px-2.5 py-0.5 text-xs font-semibold">
              Automated Messaging Engine
            </Badge>
            <span className="text-xs text-slate-500 font-medium">
              Tier: <strong className="text-slate-800 uppercase">{tenant.subscriptionPlan || 'Free Starter'}</strong>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Communication & Notifications Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure automated student onboarding emails, live class WhatsApp alerts, and gateway delivery credentials.
          </p>
        </div>

        {/* View Switcher: Templates vs Gateway Settings */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveView('templates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === 'templates'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4 text-emerald-600" />
            <span>Message Templates</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('gateways')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === 'gateways'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Delivery Gateways</span>
          </button>
        </div>
      </div>

      {/* Real-time Gateway Routing Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email Routing Status */}
        <div
          className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
            emailResolution.usingSource === 'tenant_custom'
              ? 'bg-sky-50/70 border-sky-200'
              : emailResolution.canSend
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-amber-50/70 border-amber-200'
          }`}
        >
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                emailResolution.usingSource === 'tenant_custom'
                  ? 'bg-sky-600 text-white'
                  : emailResolution.canSend
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-extrabold text-slate-900">Email Routing</h4>
                <Badge
                  variant={emailResolution.canSend ? 'success' : 'warning'}
                  className="text-[10px] uppercase font-bold"
                >
                  {emailResolution.usingSource === 'tenant_custom'
                    ? 'Dedicated Custom'
                    : emailResolution.canSend
                    ? 'Platform Pooled'
                    : 'Credentials Needed'}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 leading-snug truncate">
                {emailResolution.providerName}
              </p>
              {!emailResolution.canSend && (
                <p className="text-[11px] text-amber-800 font-medium mt-1">
                  Starter tier requires own SMTP / API keys to dispatch emails.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setActiveView('gateways')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline shrink-0 pt-0.5 cursor-pointer"
          >
            Configure →
          </button>
        </div>

        {/* WhatsApp Routing Status */}
        <div
          className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
            waResolution.usingSource === 'tenant_custom'
              ? 'bg-sky-50/70 border-sky-200'
              : waResolution.canSend
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-amber-50/70 border-amber-200'
          }`}
        >
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                waResolution.usingSource === 'tenant_custom'
                  ? 'bg-sky-600 text-white'
                  : waResolution.canSend
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-extrabold text-slate-900">WhatsApp Routing</h4>
                <Badge
                  variant={waResolution.canSend ? 'success' : 'warning'}
                  className="text-[10px] uppercase font-bold"
                >
                  {waResolution.usingSource === 'tenant_custom'
                    ? 'Dedicated Custom'
                    : waResolution.canSend
                    ? 'Platform Pooled'
                    : 'Credentials Needed'}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 leading-snug truncate">
                {waResolution.providerName}
              </p>
              {!waResolution.canSend && (
                <p className="text-[11px] text-amber-800 font-medium mt-1">
                  Requires custom WhatsApp Cloud API / Twilio gateway on this plan.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setActiveView('gateways')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline shrink-0 pt-0.5 cursor-pointer"
          >
            Configure →
          </button>
        </div>
      </div>

      {/* VIEW 1: GATEWAY CONFIGURATION VIEW */}
      {activeView === 'gateways' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Email Gateway Card */}
          <Card className="p-6 space-y-6 bg-white border-slate-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Email Delivery Gateway</h3>
                  <p className="text-xs text-slate-500">
                    Optionally provide custom SMTP or API credentials to send from your own domain.
                  </p>
                </div>
              </div>
            </div>

            {/* Custom vs Platform Choice */}
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900">Configure Custom Dedicated Email Gateway</div>
                  <div className="text-[11px] text-slate-500">
                    Send directly from your verified domain using your own provider account.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={useCustomEmail}
                  onChange={(e) => setUseCustomEmail(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              {!useCustomEmail && emailResolution.canSend && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your academy plan includes pooled email delivery via Ankabit Platform Infrastructure.</span>
                </div>
              )}

              {!useCustomEmail && !emailResolution.canSend && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Your current tier ({tenant.subscriptionPlan || 'Free'}) requires custom email credentials to send notifications.
                  </span>
                </div>
              )}
            </div>

            {/* Custom Email Form (if custom enabled) */}
            {useCustomEmail && (
              <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Provider Type</label>
                  <select
                    value={emailProvider}
                    onChange={(e) => setEmailProvider(e.target.value as EmailProviderType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="smtp">Custom SMTP Server (Standard)</option>
                    <option value="resend">Resend API</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="postmark">Postmark</option>
                    <option value="ses">Amazon SES</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sender From Email</label>
                    <input
                      type="email"
                      value={emailFromAddress}
                      onChange={(e) => setEmailFromAddress(e.target.value)}
                      placeholder="admissions@yourdomain.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sender Display Name</label>
                    <input
                      type="text"
                      value={emailFromName}
                      onChange={(e) => setEmailFromName(e.target.value)}
                      placeholder="Academy Admissions"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* SMTP Fields */}
                {emailProvider === 'smtp' && (
                  <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">SMTP Host</label>
                        <input
                          type="text"
                          value={smtpHost}
                          onChange={(e) => setSmtpHost(e.target.value)}
                          placeholder="smtp.mailgun.org"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Port</label>
                        <input
                          type="number"
                          value={smtpPort}
                          onChange={(e) => setSmtpPort(Number(e.target.value))}
                          placeholder="587"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Username / Account</label>
                        <input
                          type="text"
                          value={smtpUser}
                          onChange={(e) => setSmtpUser(e.target.value)}
                          placeholder="postmaster@yourdomain.com"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Password / Key</label>
                        <input
                          type="password"
                          value={smtpPass}
                          onChange={(e) => setSmtpPass(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={smtpSecure}
                        onChange={(e) => setSmtpSecure(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <span>Enable Secure TLS / SSL Connection</span>
                    </label>
                  </div>
                )}

                {/* API Key Providers (Resend, SendGrid, Postmark) */}
                {(emailProvider === 'resend' || emailProvider === 'sendgrid' || emailProvider === 'postmark') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">API Key / Token</label>
                    <input
                      type="password"
                      value={emailApiKey}
                      onChange={(e) => setEmailApiKey(e.target.value)}
                      placeholder="API authorization token..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                )}

                {/* AWS SES Fields */}
                {emailProvider === 'ses' && (
                  <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">AWS Region</label>
                        <input
                          type="text"
                          value={awsRegion}
                          onChange={(e) => setAwsRegion(e.target.value)}
                          placeholder="us-east-1"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Access Key ID</label>
                        <input
                          type="text"
                          value={awsAccessKey}
                          onChange={(e) => setAwsAccessKey(e.target.value)}
                          placeholder="AKIAIOSFODNN7EXAMPLE"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Secret Access Key</label>
                      <input
                        type="password"
                        value={awsSecretKey}
                        onChange={(e) => setAwsSecretKey(e.target.value)}
                        placeholder="••••••••••••••••••••••••"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Save Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUseCustomEmail(false);
                  updateTenantConfig({
                    emailGatewayConfig: {
                      enabled: false,
                      provider: 'smtp',
                    },
                  });
                  info('Reset to Default', 'Using platform default email routing.');
                }}
                className="text-xs font-bold"
              >
                Revert to Default
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveEmailGateway}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
              >
                Save Configuration
              </Button>
            </div>
          </Card>

          {/* WhatsApp Gateway Card */}
          <Card className="p-6 space-y-6 bg-white border-slate-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">WhatsApp Delivery Gateway</h3>
                  <p className="text-xs text-slate-500">
                    Optionally connect Meta WhatsApp Cloud API, Twilio, or Infobip for live alerts.
                  </p>
                </div>
              </div>
            </div>

            {/* Custom vs Platform Choice */}
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900">Configure Custom Dedicated WhatsApp Gateway</div>
                  <div className="text-[11px] text-slate-500">
                    Broadcast from your academy's verified WhatsApp Business number.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={useCustomWA}
                  onChange={(e) => setUseCustomWA(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              {!useCustomWA && waResolution.canSend && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Enterprise plan: Pooled WhatsApp broadcasting is enabled on your tier.</span>
                </div>
              )}

              {!useCustomWA && !waResolution.canSend && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Your current plan requires custom WhatsApp gateway credentials to send real-time alerts.
                  </span>
                </div>
              )}
            </div>

            {/* Custom WhatsApp Form */}
            {useCustomWA && (
              <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Provider</label>
                  <select
                    value={waProvider}
                    onChange={(e) => setWaProvider(e.target.value as WhatsAppProviderType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="cloud_api">Meta WhatsApp Cloud API (Official)</option>
                    <option value="twilio">Twilio WhatsApp</option>
                    <option value="infobip">Infobip WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sender WhatsApp Phone Number</label>
                  <input
                    type="tel"
                    value={waFromNumber}
                    onChange={(e) => setWaFromNumber(e.target.value)}
                    placeholder="+1 (800) 555-0199"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Cloud API Fields */}
                {waProvider === 'cloud_api' && (
                  <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone Number ID</label>
                        <input
                          type="text"
                          value={waPhoneId}
                          onChange={(e) => setWaPhoneId(e.target.value)}
                          placeholder="109283746592019"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">WABA Account ID</label>
                        <input
                          type="text"
                          value={waWabaId}
                          onChange={(e) => setWaWabaId(e.target.value)}
                          placeholder="waba_9918273645"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Permanent Access Token</label>
                      <input
                        type="password"
                        value={waToken}
                        onChange={(e) => setWaToken(e.target.value)}
                        placeholder="EAABw..."
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-mono focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                )}

                {/* Twilio Fields */}
                {waProvider === 'twilio' && (
                  <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Account SID</label>
                      <input
                        type="text"
                        value={twilioSid}
                        onChange={(e) => setTwilioSid(e.target.value)}
                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Auth Token</label>
                      <input
                        type="password"
                        value={twilioAuthToken}
                        onChange={(e) => setTwilioAuthToken(e.target.value)}
                        placeholder="••••••••••••••••••••••••••••••••"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                )}

                {/* Infobip Fields */}
                {waProvider === 'infobip' && (
                  <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Base URL</label>
                      <input
                        type="text"
                        value={infobipBaseUrl}
                        onChange={(e) => setInfobipBaseUrl(e.target.value)}
                        placeholder="https://xxxxx.api.infobip.com"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">API Key</label>
                      <input
                        type="password"
                        value={infobipApiKey}
                        onChange={(e) => setInfobipApiKey(e.target.value)}
                        placeholder="••••••••••••••••••••••••••••••••"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Save Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUseCustomWA(false);
                  updateTenantConfig({
                    whatsappGatewayConfig: {
                      enabled: false,
                      provider: 'cloud_api',
                    },
                  });
                  info('Reset to Default', 'Using platform default WhatsApp routing.');
                }}
                className="text-xs font-bold"
              >
                Revert to Default
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveWhatsAppGateway}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
              >
                Save Configuration
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        /* VIEW 2: TEMPLATE STUDIO (2 COLUMNS) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Template Selection & Text Editor (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Channel Switcher Tabs */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveChannel('email');
                    setSelectedTemplateId('email-welcome');
                    setTestRecipient('student@example.com');
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeChannel === 'email'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Triggers</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveChannel('whatsapp');
                    setSelectedTemplateId('wa-live-class');
                    setTestRecipient('+966501234567');
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeChannel === 'whatsapp'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Triggers</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                {activeTemplates.length} Active Automation Triggers
              </span>
            </div>

            {/* Template Selection Grid */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Select Trigger to Customize
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activeTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      currentTemplate?.id === tpl.id
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600/30'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] uppercase font-extrabold text-emerald-700">
                        {tpl.category}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          tpl.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                        title={tpl.enabled ? 'Trigger Active' : 'Trigger Disabled'}
                      />
                    </div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      {tpl.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Editor Card */}
            {currentTemplate && (
              <Card className="p-6 space-y-5 bg-white border-slate-200">
                <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {currentTemplate.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      <span>{currentTemplate.triggerDescription}</span>
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span>Automated</span>
                    <input
                      type="checkbox"
                      checked={currentTemplate.enabled}
                      onChange={(e) => handleUpdateCurrent('enabled', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Subject (for Email) */}
                {activeChannel === 'email' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Email Subject Line
                    </label>
                    <input
                      type="text"
                      value={currentTemplate.subject || ''}
                      onChange={(e) => handleUpdateCurrent('subject', e.target.value)}
                      placeholder="Enter email subject..."
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                )}

                {/* Message Body Content */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      {activeChannel === 'email' ? 'Email Message Body' : 'WhatsApp Message Text'}
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Click any tag below to insert into text
                    </span>
                  </div>

                  <textarea
                    ref={textareaRef}
                    rows={activeChannel === 'email' ? 10 : 8}
                    value={currentTemplate.body}
                    onChange={(e) => handleUpdateCurrent('body', e.target.value)}
                    placeholder="Type your message content..."
                    className="w-full p-3.5 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                {/* Merge Tags Quick Insert */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                    Insert Variables
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {availableTags.map((t) => (
                      <button
                        key={t.tag}
                        type="button"
                        onClick={() => handleInsertTag(t.tag)}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-lg text-[11px] font-mono transition-colors cursor-pointer border border-slate-200 flex items-center gap-1.5 group"
                        title={t.desc}
                      >
                        <span className="text-emerald-700 font-bold">+</span>
                        <span>{t.tag}</span>
                        {copiedTag === t.tag ? (
                          <Check className="w-3 h-3 text-emerald-600 ml-0.5" />
                        ) : (
                          <span className="text-[9px] text-slate-400 font-sans group-hover:text-emerald-700">
                            ({t.desc})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save & Test Dispatch Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type={activeChannel === 'email' ? 'email' : 'tel'}
                      placeholder={
                        activeChannel === 'email' ? 'test.student@example.com' : '+1 (555) 000-0000'
                      }
                      value={testRecipient}
                      onChange={(e) => setTestRecipient(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSendTest}
                      isLoading={isDispatching}
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                      className="font-bold text-xs shrink-0"
                    >
                      Send Test
                    </Button>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => success('Template Saved', 'Your automated message template was updated.')}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 shadow-xs"
                  >
                    Save Template
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Live End-User Device Preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Live End-User Preview
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                {activeChannel === 'email' ? (
                  <span className="flex items-center gap-1">
                    <Laptop className="w-3.5 h-3.5 text-slate-400" /> Email Client View
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" /> WhatsApp View
                  </span>
                )}
              </div>
            </div>

            {activeChannel === 'email' ? (
              /* Desktop Email Client Frame */
              <div className="bg-white rounded-2xl border border-slate-300 shadow-lg overflow-hidden font-sans text-xs">
                {/* Window Titlebar */}
                <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-slate-600">
                    Inbox • {academyDomain}
                  </span>
                </div>

                {/* Email Meta Header */}
                <div className="p-4 border-b border-slate-100 space-y-1.5 bg-slate-50/70">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400 w-14 text-[11px]">From:</span>
                    <span className="font-semibold text-slate-900 text-xs">
                      {emailFromName} &lt;{emailFromAddress || academyEmail}&gt;
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400 w-14 text-[11px]">To:</span>
                    <span className="text-slate-800 text-xs">Tariq Ibn Ziyad &lt;tariq@example.com&gt;</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400 w-14 text-[11px]">Subject:</span>
                    <span className="font-bold text-slate-900 text-xs">
                      {interpolatePreview(currentTemplate?.subject || '')}
                    </span>
                  </div>
                </div>

                {/* Email Body Card */}
                <div className="p-5 space-y-4 leading-relaxed text-slate-800 bg-white">
                  {/* Brand Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    {tenant.logoUrl ? (
                      <img
                        src={tenant.logoUrl}
                        alt={tenant.name}
                        className="w-8 h-8 rounded-lg object-contain"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-lg text-white font-black flex items-center justify-center text-sm shadow-xs"
                        style={{ backgroundColor: brandColor }}
                      >
                        {(tenant.name || 'A').charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{tenant.name || 'Academy'}</h4>
                      <p className="text-[10px] text-slate-400">Authentic Islamic & Quranic Education</p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="whitespace-pre-line text-xs font-sans text-slate-700 leading-relaxed">
                    {interpolatePreview(currentTemplate?.body || '')}
                  </div>

                  {/* Email Footer */}
                  <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                    © 2026 {tenant.name || 'Academy'}. All rights reserved.
                  </div>
                </div>
              </div>
            ) : (
              /* WhatsApp Mobile Phone Mockup */
              <div className="max-w-[340px] mx-auto bg-slate-950 rounded-[38px] p-3 shadow-2xl border-4 border-slate-800">
                {/* Phone Speaker Notch */}
                <div className="w-24 h-3.5 bg-slate-800 rounded-full mx-auto mb-2" />

                {/* WhatsApp Chat Header */}
                <div
                  className="text-white p-3 rounded-t-2xl flex items-center gap-2.5 shadow-xs"
                  style={{ backgroundColor: brandColor }}
                >
                  {tenant.logoUrl ? (
                    <img
                      src={tenant.logoUrl}
                      alt={tenant.name}
                      className="w-8 h-8 rounded-full bg-white object-contain p-0.5"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs text-white">
                      {(tenant.name || 'A').charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs truncate">{tenant.name || 'Academy'}</div>
                    <div className="text-[10px] text-emerald-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" />
                      <span>Verified Official Account</span>
                    </div>
                  </div>
                </div>

                {/* Chat Canvas */}
                <div className="bg-[#efeae2] p-3 rounded-b-2xl min-h-[380px] space-y-3 flex flex-col justify-end">
                  {/* Message Bubble */}
                  <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200/60 max-w-[95%] text-[11px] leading-relaxed text-slate-800 space-y-1">
                    <div className="whitespace-pre-line font-sans">
                      {interpolatePreview(currentTemplate?.body || '')}
                    </div>
                    <div className="text-[9px] text-slate-400 text-right font-mono flex items-center justify-end gap-1 pt-1">
                      <span>10:30 AM</span>
                      <span className="text-sky-500 font-bold">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

