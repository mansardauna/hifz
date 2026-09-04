import React, { useState } from 'react';
import {
  Zap,
  Play,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock,
  Mail,
  MessageSquare,
  Users,
  CreditCard,
  Video,
  FileCheck,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Settings,
  Trash2,
  RefreshCw,
  Sliders,
  Send,
  Bell,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Badge } from '../ui';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  triggerCategory: 'forms' | 'billing' | 'classroom' | 'lms' | 'leads';
  actions: string[];
  channels: ('email' | 'sms' | 'whatsapp' | 'livekit' | 'crm' | 'webhook')[];
  enabled: boolean;
  executionCount: number;
  lastRun: string;
}

interface ExecutionLog {
  id: string;
  automationName: string;
  triggerEvent: string;
  recipient: string;
  status: 'Success' | 'Failed' | 'Pending';
  executionTimeMs: number;
  timestamp: string;
  details: string;
}

interface AutomationsManagerProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const AutomationsManager: React.FC<AutomationsManagerProps> = ({ onAddToast }) => {
  const { tenant } = useTenant();

  const [automations, setAutomations] = useState<AutomationRule[]>([
    {
      id: 'auto-1',
      name: 'Admissions Inquiry & Instant Lead Follow-Up',
      description: 'When a prospective student submits any admissions form, send instant branded welcome email, create CRM lead record, and notify admissions committee.',
      trigger: 'On Form Submission (Any Form)',
      triggerCategory: 'forms',
      actions: ['Send Welcome Email with Course Syllabus', 'Add Lead to CRM Pipeline', 'Send Slack/Email Alert to Ustadh'],
      channels: ['email', 'crm', 'webhook'],
      enabled: true,
      executionCount: 142,
      lastRun: '12 mins ago'
    },
    {
      id: 'auto-2',
      name: 'Tuition Payment & Instant LMS Account Provisioning',
      description: 'When Stripe or Moyasar payment succeeds, automatically create student LMS login, assign enrolled courses, and email official invoice receipt.',
      trigger: 'On Stripe / Card Payment Succeeded',
      triggerCategory: 'billing',
      actions: ['Generate Tax PDF Receipt', 'Provision LMS Account with Password Link', 'Unlock Enrolled Curriculums'],
      channels: ['email', 'crm'],
      enabled: true,
      executionCount: 89,
      lastRun: '1 hour ago'
    },
    {
      id: 'auto-3',
      name: 'Virtual Classroom 15-Minute Broadcast',
      description: 'Automatically send a reminder with the direct LiveKit WebRTC room link 15 minutes before scheduled live classes.',
      trigger: '15 Minutes Before Live Session Starts',
      triggerCategory: 'classroom',
      actions: ['Send WhatsApp Broadcast', 'Send Push Notification & Email with One-Click Join Link'],
      channels: ['whatsapp', 'email', 'livekit'],
      enabled: true,
      executionCount: 320,
      lastRun: 'Yesterday at 17:45'
    },
    {
      id: 'auto-4',
      name: 'Tajweed Recitation Submission Review Queue',
      description: 'When a student records & uploads recitation audio, run AI Tajweed pre-analysis and assign to the teacher\'s grading queue.',
      trigger: 'On Recitation Audio Uploaded',
      triggerCategory: 'lms',
      actions: ['Transcribe & Calculate Makharij Confidence', 'Assign Review Ticket to Sanad Ustadh', 'Send Student Confirmation'],
      channels: ['crm', 'email'],
      enabled: true,
      executionCount: 267,
      lastRun: '3 hours ago'
    },
    {
      id: 'auto-5',
      name: 'Student Retention & 7-Day Inactivity Check',
      description: 'If an enrolled student does not log into the LMS for 7 consecutive days, send an encouraging reminder email and flag for mentor outreach.',
      trigger: 'Student Inactive for 7 Days',
      triggerCategory: 'leads',
      actions: ['Send Motivational Tajweed Study Tip', 'Create High-Priority Retention Task for Mentor'],
      channels: ['email', 'crm'],
      enabled: true,
      executionCount: 45,
      lastRun: '2 days ago'
    }
  ]);

  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([
    {
      id: 'log-801',
      automationName: 'Admissions Inquiry & Instant Lead Follow-Up',
      triggerEvent: 'Form submitted by Zaid Al-Harithi',
      recipient: 'zaid.harithi@example.com',
      status: 'Success',
      executionTimeMs: 145,
      timestamp: '2026-09-03 10:35:12',
      details: 'Sent Welcome Syllabus PDF + Created Lead #lead-101 + Notified Ustadh Tariq'
    },
    {
      id: 'log-802',
      automationName: 'Tuition Payment & Instant LMS Account Provisioning',
      triggerEvent: 'Stripe $140.00 charge succeeded (ch_3M4k9)',
      recipient: 'hamza.yusuf@example.com',
      status: 'Success',
      executionTimeMs: 230,
      timestamp: '2026-09-03 09:12:40',
      details: 'Invoice #INV-2026-89 created + Sent LMS credentials'
    },
    {
      id: 'log-803',
      automationName: 'Tajweed Recitation Submission Review Queue',
      triggerEvent: 'Audio recitation uploaded for Surah Al-Mulk',
      recipient: 'ustadh.rahman@al-furqan.org',
      status: 'Success',
      executionTimeMs: 310,
      timestamp: '2026-09-03 07:44:02',
      details: 'AI Score: 94% Tajweed accuracy + Assigned ticket #REV-442'
    },
    {
      id: 'log-804',
      automationName: 'Virtual Classroom 15-Minute Broadcast',
      triggerEvent: 'Class "Evening Tajweed Halaqah" starting at 18:00',
      recipient: '24 Enrolled Students',
      status: 'Success',
      executionTimeMs: 412,
      timestamp: '2026-09-02 17:45:00',
      details: 'Dispatched 24 WhatsApp & Email room alerts with WebRTC link'
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDescription, setNewRuleDescription] = useState('');
  const [newRuleTrigger, setNewRuleTrigger] = useState('On Form Submission');
  const [newRuleAction, setNewRuleAction] = useState('Send Email & Add to CRM');

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.enabled;
          onAddToast({
            type: nextState ? 'success' : 'info',
            title: nextState ? 'Workflow Activated' : 'Workflow Paused',
            message: `"${item.name}" is now ${nextState ? 'active and listening' : 'paused'}.`
          });
          return { ...item, enabled: nextState };
        }
        return item;
      })
    );
  };

  const handleTestTrigger = (auto: AutomationRule) => {
    const newLog: ExecutionLog = {
      id: `log-${Date.now()}`,
      automationName: auto.name,
      triggerEvent: `Manual Test Triggered by Admin`,
      recipient: 'admin@' + tenant.subdomain + '.ankabit.app',
      status: 'Success',
      executionTimeMs: Math.floor(Math.random() * 200) + 80,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      details: `Test execution verified 100% successful with all actions dispatched.`
    };

    setExecutionLogs([newLog, ...executionLogs]);
    setAutomations((prev) =>
      prev.map((r) => (r.id === auto.id ? { ...r, executionCount: r.executionCount + 1, lastRun: 'Just now' } : r))
    );

    onAddToast({
      type: 'success',
      title: 'Workflow Tested Successfully',
      message: `Executed "${auto.name}" with 0 errors.`
    });
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const newRule: AutomationRule = {
      id: `auto-${Date.now()}`,
      name: newRuleName.trim(),
      description: newRuleDescription.trim() || 'Custom automated trigger and action sequence.',
      trigger: newRuleTrigger,
      triggerCategory: 'forms',
      actions: [newRuleAction],
      channels: ['email', 'crm'],
      enabled: true,
      executionCount: 0,
      lastRun: 'Never'
    };

    setAutomations([newRule, ...automations]);
    setIsCreateModalOpen(false);
    setNewRuleName('');
    setNewRuleDescription('');

    onAddToast({
      type: 'success',
      title: 'New Workflow Created',
      message: `Automation "${newRule.name}" has been published and activated.`
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Workflows & Academy Automations</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automate student onboarding, payment receipts, classroom reminders, and staff notification triggers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Create New Automation
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Workflows</span>
          <div className="text-2xl font-black text-slate-900">{automations.filter((a) => a.enabled).length} / {automations.length}</div>
          <p className="text-[10px] text-emerald-600 font-bold">● Running continuously</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Executions</span>
          <div className="text-2xl font-black text-slate-900">863</div>
          <p className="text-[10px] text-blue-600 font-bold">+18 today</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Success Rate</span>
          <div className="text-2xl font-black text-slate-900">99.8%</div>
          <p className="text-[10px] text-emerald-600 font-bold">0 critical failures</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Execution Time</span>
          <div className="text-2xl font-black text-slate-900">182ms</div>
          <p className="text-[10px] text-slate-400">Edge serverless runtime</p>
        </div>
      </div>

      {/* Active Automations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-700" />
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Configured Automation Rules</h3>
          </div>
          <span className="text-xs text-slate-500">{automations.length} total rules</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Workflow Name & Description</th>
                <th className="py-3.5 px-4">Trigger Event</th>
                <th className="py-3.5 px-4">Dispatched Actions</th>
                <th className="py-3.5 px-4 text-center">Executions</th>
                <th className="py-3.5 px-4">Last Run</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {automations.map((auto) => (
                <tr key={auto.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      {auto.name}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{auto.description}</p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px] inline-flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 fill-current" /> {auto.trigger}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {auto.actions.map((act, i) => (
                        <div key={i} className="flex items-center gap-1 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900 font-mono">
                    {auto.executionCount}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                    {auto.lastRun}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => toggleAutomation(auto.id)}
                      className="cursor-pointer inline-flex items-center transition-transform active:scale-95"
                      title={auto.enabled ? 'Click to Pause' : 'Click to Enable'}
                    >
                      {auto.enabled ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                          Paused
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleTestTrigger(auto)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      title="Simulate / Test Trigger"
                    >
                      <Play className="w-3 h-3 fill-current text-slate-700" /> Test
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Execution Logs Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Live Workflow Execution Logs</h3>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Real-Time Audit Log
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Workflow</th>
                <th className="py-3.5 px-4">Trigger Context</th>
                <th className="py-3.5 px-4">Recipient / Target</th>
                <th className="py-3.5 px-4">Result</th>
                <th className="py-3.5 px-4">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {executionLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {log.automationName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                    {log.triggerEvent}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-mono text-[11px]">
                    {log.recipient}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> {log.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {log.executionTimeMs}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create New Automation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">Create Workflow Automation</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Workflow Name</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Student WhatsApp Welcome"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Trigger Event</label>
                <select
                  value={newRuleTrigger}
                  onChange={(e) => setNewRuleTrigger(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none"
                >
                  <option value="On Form Submission">When Student Submits Admissions Form</option>
                  <option value="On Payment Succeeded">When Tuition Payment is Completed (Stripe)</option>
                  <option value="15 Mins Before Class">15 Minutes Before Live Classroom Session</option>
                  <option value="On Recitation Upload">When Audio Recitation is Uploaded</option>
                  <option value="On Status Changed to Admitted">When Lead is Marked 'Admitted'</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Action to Execute</label>
                <select
                  value={newRuleAction}
                  onChange={(e) => setNewRuleAction(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none"
                >
                  <option value="Send Email & Add to CRM">Send Custom Email & Create CRM Record</option>
                  <option value="Send WhatsApp / SMS Notification">Send Instant WhatsApp Message with Link</option>
                  <option value="Provision Student LMS Account">Provision LMS Account & Email Password Setup</option>
                  <option value="Webhook Dispatch to Zapier / Make">Post JSON Payload to Webhook URL</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Description (Optional)</label>
                <textarea
                  placeholder="Briefly describe what this automation accomplishes..."
                  value={newRuleDescription}
                  onChange={(e) => setNewRuleDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Save & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
