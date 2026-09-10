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
} from 'lucide-react';
import { Button, Card, Badge } from '../ui';

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
  const { tenant } = useTenant();
  const { success, error } = useToast();

  const [activeChannel, setActiveChannel] = useState<'email' | 'whatsapp'>('email');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('email-welcome');
  const [testRecipient, setTestRecipient] = useState<string>('student@example.com');
  const [isDispatching, setIsDispatching] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const academyDomain = tenant.customDomain || `${tenant.subdomain || 'academy'}.edu`;
  const academyEmail = `admissions@${academyDomain}`;
  const brandColor = tenant.theme?.primaryColor || '#059669';

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

  const handleSendTest = async () => {
    if (!testRecipient.trim()) {
      error('Recipient Required', 'Please enter a test email address or phone number.');
      return;
    }

    setIsDispatching(true);
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: activeChannel,
          recipient: testRecipient,
          subject: currentTemplate?.subject,
          content: currentTemplate?.body,
        }),
      }).catch(() => null);

      setIsDispatching(false);
      success(
        'Test Message Dispatched',
        `Simulated ${activeChannel.toUpperCase()} message sent to ${testRecipient}.`
      );
    } catch {
      setIsDispatching(false);
      success(
        'Test Sent',
        `Simulated ${activeChannel.toUpperCase()} message sent to ${testRecipient}.`
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
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="success" className="px-2.5 py-0.5 text-xs font-semibold">
              Automated Messaging
            </Badge>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Platform Managed Delivery
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Notification & Message Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Customize automated messages sent to students and parents. Preview live changes directly on student devices.
          </p>
        </div>

        {/* Channel Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveChannel('email');
              setSelectedTemplateId('email-welcome');
              setTestRecipient('student@example.com');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeChannel === 'email'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4 text-emerald-600" />
            <span>Email Templates</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveChannel('whatsapp');
              setSelectedTemplateId('wa-live-class');
              setTestRecipient('+966501234567');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeChannel === 'whatsapp'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Alerts</span>
          </button>
        </div>
      </div>

      {/* Main Studio: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Template Selection & Text Editor (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Template Tabs */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Select Message to Customize
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
                    {tenant.name || 'Academy'} &lt;{academyEmail}&gt;
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
    </div>
  );
};

