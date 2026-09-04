import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useToast } from '../../context/ToastContext';
import {
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  Smartphone,
  Eye,
  CheckCircle2,
  Clock,
  Zap,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  DollarSign,
  Video,
  FileCheck,
  UserCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Button, Card, Badge, Modal } from '../ui';

interface EmailTemplate {
  id: string;
  name: string;
  triggerEvent: string;
  subject: string;
  body: string;
  enabled: boolean;
  category: 'admissions' | 'billing' | 'lms';
}

interface WhatsAppTemplate {
  id: string;
  name: string;
  triggerEvent: string;
  content: string;
  enabled: boolean;
  category: 'classroom' | 'milestone' | 'attendance';
}

export const CommunicationAutomationHub: React.FC = () => {
  const { tenant } = useTenant();
  const { success, error, info } = useToast();

  const [activeChannel, setActiveChannel] = useState<'email' | 'whatsapp'>('email');
  const [selectedEmailId, setSelectedEmailId] = useState<string>('email-1');
  const [selectedWhatsAppId, setSelectedWhatsAppId] = useState<string>('wa-1');

  // Test dispatch state
  const [testRecipient, setTestRecipient] = useState<string>('student@example.com');
  const [isDispatching, setIsDispatching] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  // Email templates
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
    {
      id: 'email-1',
      name: 'Admissions Acceptance & LMS Credentials',
      triggerEvent: 'When Student Application is Admitted in CRM',
      subject: `Welcome to ${tenant.name || 'Hifz Academy'} - Your Student LMS Credentials`,
      body: `Assalamu Alaikum wa Rahmatullah {{student_name}},

Alhamdulillah! We are delighted to inform you that your application for "{{course_title}}" has been approved.

Your student portal account has been provisioned:
• Student Portal: {{portal_url}}
• Login Email: {{student_email}}
• Temporary Password: {{temp_password}}

Please log in and update your password before your first orientation halaqah on {{orientation_date}}.

Barakallahu Feekum,
Academic Director, ${tenant.name}`,
      enabled: true,
      category: 'admissions',
    },
    {
      id: 'email-2',
      name: 'Monthly Tuition Invoice Due Reminder',
      triggerEvent: '3 Days Before Invoice Due Date',
      subject: `Tuition Invoice Due for {{course_title}} - ${tenant.name}`,
      body: `Assalamu Alaikum {{parent_name}},

This is a gentle reminder that your tuition invoice of {{invoice_amount}} for the upcoming billing cycle is due on {{due_date}}.

You can securely pay online with Apple Pay, Mada, or Credit Card using the link below:
{{payment_link}}

Thank you for your continuous support of authentic Quranic education.

Admissions & Finance Office, ${tenant.name}`,
      enabled: true,
      category: 'billing',
    },
    {
      id: 'email-3',
      name: 'Recitation Submission Graded Feedback',
      triggerEvent: 'When Ustadh Grades Audio Recitation Submission',
      subject: `New Teacher Feedback on Surah {{surah_name}} - ${tenant.name}`,
      body: `Assalamu Alaikum {{student_name}},

Your instructor {{teacher_name}} has reviewed your recitation for Surah {{surah_name}} (Ayah {{ayah_start}} to {{ayah_end}}).

• Score: {{grade_score}} / 100
• Status: {{submission_status}}
• Ustadh Feedback: "{{teacher_comments}}"

Log in to listen to your teacher's voice feedback:
{{portal_url}}/lms/recitations

Keep striving for perfection in your Tajweed!`,
      enabled: true,
      category: 'lms',
    },
  ]);

  // WhatsApp templates
  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplate[]>([
    {
      id: 'wa-1',
      name: '15-Minute Live Halaqah Broadcast',
      triggerEvent: '15 Minutes Before Scheduled Live WebRTC Class',
      content: `🔔 *Live Halaqah Starting Soon!*

Assalamu Alaikum {{student_name}}, your live Quran class for *{{course_title}}* begins in 15 minutes with {{teacher_name}}.

📲 *Join Live Classroom:*
{{room_url}}

Please have your Mushaf ready and ensure a quiet reciting environment.`,
      enabled: true,
      category: 'classroom',
    },
    {
      id: 'wa-2',
      name: 'Parent Memorization Milestone Celebration',
      triggerEvent: 'When Student Completes a Surah or Juz',
      content: `🎉 *Mubarak! Memorization Milestone Achieved!*

Assalamu Alaikum {{parent_name}},

Alhamdulillah! Your child *{{student_name}}* has successfully completed the memorization and Tajweed testing for *{{surah_name}}* today with a score of *{{grade_score}}%*!

May Allah bless their journey in holding the words of the Quran in their heart.

— ${tenant.name}`,
      enabled: true,
      category: 'milestone',
    },
    {
      id: 'wa-3',
      name: 'Unexcused Attendance Notification',
      triggerEvent: 'When Student Misses Live Session',
      content: `⚠️ *Attendance Notice - ${tenant.name}*

Assalamu Alaikum {{parent_name}},

Our records indicate that *{{student_name}}* was marked absent for today's live class *{{course_title}}* at {{halaqah_time}}.

If this was due to an emergency, please notify the director at {{contact_phone}}.`,
      enabled: true,
      category: 'attendance',
    },
  ]);

  const currentEmail = emailTemplates.find((e) => e.id === selectedEmailId) || emailTemplates[0];
  const currentWhatsApp = whatsappTemplates.find((w) => w.id === selectedWhatsAppId) || whatsappTemplates[0];

  const handleUpdateEmail = (field: keyof EmailTemplate, val: any) => {
    setEmailTemplates((prev) =>
      prev.map((e) => (e.id === selectedEmailId ? { ...e, [field]: val } : e))
    );
  };

  const handleUpdateWhatsApp = (field: keyof WhatsAppTemplate, val: any) => {
    setWhatsappTemplates((prev) =>
      prev.map((w) => (w.id === selectedWhatsAppId ? { ...w, [field]: val } : w))
    );
  };

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    success('Tag Copied', `${tag} copied to clipboard.`);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleSendTestDispatch = async () => {
    if (!testRecipient.trim()) {
      error('Recipient Required', 'Please enter a test email address or WhatsApp number.');
      return;
    }

    setIsDispatching(true);
    try {
      const payload = {
        channel: activeChannel,
        recipient: testRecipient,
        subject: activeChannel === 'email' ? currentEmail.subject : undefined,
        content: activeChannel === 'email' ? currentEmail.body : currentWhatsApp.content,
      };

      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIsDispatching(false);

      if (data.success) {
        success(
          'Test Dispatched! 🚀',
          `Simulated ${activeChannel.toUpperCase()} alert sent to ${testRecipient} (ID: ${data.messageId}).`
        );
      } else {
        error('Dispatch Failed', data.message || 'Error sending test message.');
      }
    } catch (e: any) {
      setIsDispatching(false);
      error('Dispatch Error', e?.message || 'Could not connect to notification API.');
    }
  };

  const availableTags = [
    { tag: '{{student_name}}', desc: 'Full student name' },
    { tag: '{{parent_name}}', desc: 'Parent or guardian name' },
    { tag: '{{course_title}}', desc: 'Course or halaqah title' },
    { tag: '{{portal_url}}', desc: 'Academy student login URL' },
    { tag: '{{temp_password}}', desc: 'Auto-generated secure password' },
    { tag: '{{invoice_amount}}', desc: 'Tuition invoice fee' },
    { tag: '{{payment_link}}', desc: '1-Click Stripe / Moyasar checkout' },
    { tag: '{{room_url}}', desc: 'Direct LiveKit WebRTC halaqah link' },
    { tag: '{{surah_name}}', desc: 'Current Surah being tested' },
    { tag: '{{grade_score}}', desc: 'Sheikh recitation score (0-100)' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="success" className="mb-2">
            Multi-Channel Communication Engine
          </Badge>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Automated Email & WhatsApp Notification Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure automated student onboarding emails, live class WhatsApp alerts, and parent milestone broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeChannel === 'email' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => {
              setActiveChannel('email');
              setTestRecipient('student@example.com');
            }}
            leftIcon={<Mail className="w-4 h-4" />}
            className="font-bold text-xs"
          >
            Email (Resend / SendGrid)
          </Button>

          <Button
            variant={activeChannel === 'whatsapp' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => {
              setActiveChannel('whatsapp');
              setTestRecipient('+966501234567');
            }}
            leftIcon={<MessageSquare className="w-4 h-4" />}
            className="font-bold text-xs"
          >
            WhatsApp & SMS (Twilio)
          </Button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Template Selector & Editor (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Template Selection Pills */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Active {activeChannel === 'email' ? 'Email' : 'WhatsApp'} Automation Triggers
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeChannel === 'email'
                ? emailTemplates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedEmailId(tpl.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedEmailId === tpl.id
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600/30'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-700">
                          {tpl.category}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            tpl.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        />
                      </div>
                      <div className="text-xs font-bold text-slate-900 leading-snug truncate">
                        {tpl.name}
                      </div>
                    </button>
                  ))
                : whatsappTemplates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedWhatsAppId(tpl.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedWhatsAppId === tpl.id
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600/30'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-700">
                          {tpl.category}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            tpl.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        />
                      </div>
                      <div className="text-xs font-bold text-slate-900 leading-snug truncate">
                        {tpl.name}
                      </div>
                    </button>
                  ))}
            </div>
          </div>

          {/* Template Editor Form */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {activeChannel === 'email' ? currentEmail.name : currentWhatsApp.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Trigger: <strong className="text-emerald-700">{activeChannel === 'email' ? currentEmail.triggerEvent : currentWhatsApp.triggerEvent}</strong>
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700">
                <span>Active</span>
                <input
                  type="checkbox"
                  checked={activeChannel === 'email' ? currentEmail.enabled : currentWhatsApp.enabled}
                  onChange={(e) =>
                    activeChannel === 'email'
                      ? handleUpdateEmail('enabled', e.target.checked)
                      : handleUpdateWhatsApp('enabled', e.target.checked)
                  }
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
            </div>

            {/* Email Subject if Email */}
            {activeChannel === 'email' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Subject Line</label>
                <input
                  type="text"
                  value={currentEmail.subject}
                  onChange={(e) => handleUpdateEmail('subject', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            )}

            {/* Content Body */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {activeChannel === 'email' ? 'Email Body Content (Markdown Supported)' : 'WhatsApp Text Content'}
              </label>
              <textarea
                rows={activeChannel === 'email' ? 10 : 8}
                value={activeChannel === 'email' ? currentEmail.body : currentWhatsApp.content}
                onChange={(e) =>
                  activeChannel === 'email'
                    ? handleUpdateEmail('body', e.target.value)
                    : handleUpdateWhatsApp('content', e.target.value)
                }
                className="w-full p-3 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 leading-relaxed focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Dynamic Merge Tags Helper */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
                Click to Insert Merge Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((t) => (
                  <button
                    key={t.tag}
                    type="button"
                    onClick={() => handleCopyTag(t.tag)}
                    className="px-2 py-1 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 rounded-lg text-[11px] font-mono transition-colors cursor-pointer border border-slate-200 flex items-center gap-1"
                    title={t.desc}
                  >
                    <span>{t.tag}</span>
                    {copiedTag === t.tag ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Save & Test Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <input
                  type={activeChannel === 'email' ? 'email' : 'tel'}
                  placeholder={activeChannel === 'email' ? 'Enter test email...' : 'Enter test WhatsApp (+1234...)'}
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendTestDispatch}
                  isLoading={isDispatching}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                  className="font-bold text-xs"
                >
                  Send Test
                </Button>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => success('Template Saved', 'Automation template updated and deployed.')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                Save Template
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: Live Interactive Mock Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Live End-User Device Preview
              </span>
            </div>
            <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 text-[10px]">
              {activeChannel.toUpperCase()} Render
            </Badge>
          </div>

          {activeChannel === 'email' ? (
            /* Desktop Email Client Preview Frame */
            <div className="bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden font-sans text-xs">
              {/* Window Bar */}
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] font-bold font-mono">Mail • {tenant.subdomain}.ankabit.app</span>
              </div>

              {/* Email Headers */}
              <div className="p-4 border-b border-slate-100 space-y-1.5 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500 w-12 text-[11px]">From:</span>
                  <span className="font-semibold text-slate-900">{tenant.name} &lt;admissions@{tenant.subdomain}.ankabit.app&gt;</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500 w-12 text-[11px]">To:</span>
                  <span className="text-slate-800">Tariq Ibn Ziyad &lt;tariq@example.com&gt;</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500 w-12 text-[11px]">Subject:</span>
                  <span className="font-black text-slate-900">
                    {currentEmail.subject
                      .replace('{{student_name}}', 'Tariq')
                      .replace('{{course_title}}', 'Tajweed Al-Maysar')}
                  </span>
                </div>
              </div>

              {/* Email Body Content */}
              <div className="p-5 space-y-4 leading-relaxed text-slate-800">
                {/* Brand Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center">
                    {tenant.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{tenant.name}</h4>
                    <p className="text-[10px] text-slate-400">Authentic Educational Institute</p>
                  </div>
                </div>

                <div className="whitespace-pre-line text-xs font-sans text-slate-700">
                  {currentEmail.body
                    .replace('{{student_name}}', 'Tariq Ibn Ziyad')
                    .replace('{{parent_name}}', 'Abu Tariq')
                    .replace('{{course_title}}', 'Advanced Tajweed & Ijazah Track')
                    .replace('{{portal_url}}', `https://${tenant.subdomain}.ankabit.app/login`)
                    .replace('{{student_email}}', 'tariq@example.com')
                    .replace('{{temp_password}}', 'Hifz@2026!')
                    .replace('{{orientation_date}}', 'Monday, Sep 8, 2026')
                    .replace('{{invoice_amount}}', '$65.00')
                    .replace('{{due_date}}', 'Sep 10, 2026')
                    .replace('{{payment_link}}', `https://${tenant.subdomain}.ankabit.app/pay/inv_9921`)}
                </div>

                <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                  © 2026 {tenant.name} • Powered by Ankabit LMS
                </div>
              </div>
            </div>
          ) : (
            /* Smartphone WhatsApp Chat Bubble Preview */
            <div className="max-w-[340px] mx-auto bg-slate-950 rounded-[38px] p-3 shadow-2xl border-4 border-slate-800">
              {/* Phone Speaker Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2" />

              {/* Chat Header */}
              <div className="bg-emerald-800 text-white p-3 rounded-t-2xl flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
                  {tenant.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs truncate">{tenant.name} Official</div>
                  <div className="text-[10px] text-emerald-200">Verified Business Account</div>
                </div>
              </div>

              {/* Chat Canvas (WhatsApp Pattern) */}
              <div className="bg-[#efeae2] p-3 rounded-b-2xl min-h-[360px] space-y-3 flex flex-col justify-end">
                {/* Incoming Message Bubble */}
                <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-sm border border-slate-200 max-w-[90%] text-[11px] leading-relaxed text-slate-800 space-y-1">
                  <div className="whitespace-pre-line">
                    {currentWhatsApp.content
                      .replace('{{student_name}}', 'Tariq')
                      .replace('{{parent_name}}', 'Abu Tariq')
                      .replace('{{course_title}}', 'Hifz Revision Halaqah')
                      .replace('{{teacher_name}}', 'Sheikh Tariq')
                      .replace('{{room_url}}', `https://${tenant.subdomain}.ankabit.app/classroom/huddle-1`)
                      .replace('{{surah_name}}', 'Surah Maryam (Juz 16)')
                      .replace('{{grade_score}}', '98')
                      .replace('{{halaqah_time}}', '18:00 UTC')
                      .replace('{{contact_phone}}', tenant.contactPhone || '+966 50 123 4567')}
                  </div>
                  <div className="text-[9px] text-slate-400 text-right font-mono flex items-center justify-end gap-1">
                    <span>17:45</span>
                    <span className="text-sky-500 font-black">✓✓</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
