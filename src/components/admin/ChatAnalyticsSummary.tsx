import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Search,
  Filter,
  Download,
  TrendingUp,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  Clock,
  BookOpen,
  Code2,
  Check,
  Tag
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Badge } from '../ui';
import { detectTenantNicheType } from '../../services/classroomCustomizationService';

interface ChatMessageRecord {
  id: string;
  channel: 'Live Classroom' | 'Admissions Helpdesk' | 'Student Forum';
  senderName: string;
  senderRole: 'student' | 'teacher' | 'prospect';
  message: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'question' | 'difficulty';
  resolved: boolean;
  topicTag: string;
}

interface ChatAnalyticsSummaryProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const ChatAnalyticsSummary: React.FC<ChatAnalyticsSummaryProps> = ({ onAddToast }) => {
  const { tenant } = useTenant();
  const nicheType = detectTenantNicheType(tenant);
  const isCoding = nicheType === 'coding';
  const isSchool = nicheType === 'school';
  const isQuran = nicheType === 'quran';

  const [chatRecords, setChatRecords] = useState<ChatMessageRecord[]>([
    {
      id: 'msg-101',
      channel: 'Live Classroom',
      senderName: isQuran ? 'Fatima Zahra' : 'Sarah Jenkins',
      senderRole: 'student',
      message: isCoding
        ? 'How do we handle optimistic UI rollback if the server action throws a database error?'
        : isQuran
        ? 'Ustadh, should the Ghunnah on Noon Sakinah with Ikhfaa be held for exactly 2 harakahs in Surah Al-Mulk ayah 12?'
        : isSchool
        ? 'Professor, should the derivation for the Taylor series error bound be evaluated at the interval endpoint?'
        : 'Instructor, how should we structure the project rubric evaluation for Module 3 practical case studies?',
      timestamp: 'Today at 10:14 AM',
      sentiment: 'question',
      resolved: true,
      topicTag: isCoding ? 'Server Actions' : isQuran ? 'Tajweed - Ghunnah' : isSchool ? 'Calculus - Taylor Series' : 'Module 3 Rubric'
    },
    {
      id: 'msg-102',
      channel: 'Live Classroom',
      senderName: isQuran ? 'Ibrahim Khalil' : 'Alex Parker',
      senderRole: 'student',
      message: isCoding
        ? 'The sandbox terminal is showing an undefined token for the Prisma client inside edge runtime.'
        : isQuran
        ? 'Is it permissible to connect the recitation with the Basmalah between Surah Al-Anfal and At-Tawbah?'
        : isSchool
        ? 'In lab assignment 4, does the cellular respiration rate require temperature normalization?'
        : 'In the practical simulation, should we account for seasonal variance in our financial model?',
      timestamp: 'Today at 10:22 AM',
      sentiment: 'difficulty',
      resolved: false,
      topicTag: isCoding ? 'Prisma Edge' : isQuran ? 'Tajweed - Basmalah' : isSchool ? 'Biology Lab' : 'Simulation Model'
    },
    {
      id: 'msg-103',
      channel: 'Admissions Helpdesk',
      senderName: isQuran ? 'Dr. Tariq Al-Mansoor (Parent)' : 'David Morgan (Parent / Sponsor)',
      senderRole: 'prospect',
      message: isCoding
        ? 'Do bootcamp graduates receive 1-on-1 portfolio code reviews and mock technical interviews?'
        : isQuran
        ? 'Do you offer flexible evening Muraja\'ah revision halaqahs for full-time working professionals?'
        : isSchool
        ? 'Do you offer AP Calculus and Honors Chemistry tutoring during after-school sessions?'
        : 'Do you offer flexible evening cohorts for working professionals in the executive track?',
      timestamp: 'Yesterday at 16:40',
      sentiment: 'positive',
      resolved: true,
      topicTag: 'Admissions Inquiry'
    },
    {
      id: 'msg-104',
      channel: 'Student Forum',
      senderName: isQuran ? 'Amina Khatun' : 'Elena Rostova',
      senderRole: 'student',
      message: isCoding
        ? 'Completed the React custom hook exercise! The live compiler feedback made debugging seamless.'
        : isQuran
        ? 'Alhamdulillah completed the audio recording loop for Juz 29 with 95% accuracy score today!'
        : isSchool
        ? 'Submitted the Physics lab derivation with 96% accuracy on the experimental data graphs!'
        : 'Completed the applied capstone case study with 95% evaluation score today!',
      timestamp: 'Yesterday at 19:10',
      sentiment: 'positive',
      resolved: true,
      topicTag: isCoding ? 'Coursework Feedback' : isQuran ? 'Hifz Progress' : isSchool ? 'Lab Submission' : 'Capstone Progress'
    },
    {
      id: 'msg-105',
      channel: 'Live Classroom',
      senderName: 'Rachel Green',
      senderRole: 'student',
      message: isCoding
        ? 'Could we review TypeScript discriminated unions before the weekly project submission?'
        : isQuran
        ? 'Ustadh, please re-demonstrate the Makhraj of letter Dad (ض) with the audio looper tool.'
        : isSchool
        ? 'Could we review Stokes\' Theorem problem sets before tomorrow\'s seminar session?'
        : 'Could we review the performance optimization criteria before our weekly project defense?',
      timestamp: 'Sept 1 at 11:05 AM',
      sentiment: 'question',
      resolved: true,
      topicTag: isCoding ? 'TypeScript' : isQuran ? 'Makharij' : isSchool ? 'Multivariable Calculus' : 'Project Defense'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');

  const filteredMessages = chatRecords.filter((msg) => {
    const matchesSearch =
      msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.topicTag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = channelFilter === 'all' || msg.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  const toggleResolved = (id: string) => {
    setChatRecords((prev) =>
      prev.map((m) => (m.id === id ? { ...m, resolved: !m.resolved } : m))
    );
    onAddToast({
      type: 'success',
      title: 'Status Updated',
      message: 'Question resolution status has been updated.'
    });
  };

  const handleExportTranscripts = () => {
    const headers = ['ID', 'Channel', 'Sender', 'Role', 'Message', 'Topic', 'Date', 'Resolved'];
    const rows = filteredMessages.map((m) => [
      m.id,
      `"${m.channel}"`,
      `"${m.senderName}"`,
      m.senderRole,
      `"${m.message.replace(/"/g, '""')}"`,
      `"${m.topicTag}"`,
      `"${m.timestamp}"`,
      m.resolved ? 'Yes' : 'No'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `chat_transcripts_${tenant.subdomain}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddToast({
      type: 'success',
      title: 'Transcripts Exported',
      message: `Downloaded ${filteredMessages.length} chat message logs.`
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Chat Intelligence & Student Insights</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated question collection, sentiment tracking, and AI-generated summary reports from live classes and helpdesks.
          </p>
        </div>

        <button
          onClick={handleExportTranscripts}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" /> Export Transcripts
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Messages Analyzed</span>
          <div className="text-2xl font-black text-slate-900">{chatRecords.length * 28 + 140}</div>
          <p className="text-[10px] text-blue-600 font-bold">Across 3 channels</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Positive Sentiment</span>
          <div className="text-2xl font-black text-slate-900">96.2%</div>
          <p className="text-[10px] text-emerald-600 font-bold">High student engagement</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Question Resolution</span>
          <div className="text-2xl font-black text-slate-900">98.4%</div>
          <p className="text-[10px] text-emerald-600 font-bold">Avg answer: 2.1 mins</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Open Student Inquiries</span>
          <div className="text-2xl font-black text-slate-900">{chatRecords.filter((c) => !c.resolved).length}</div>
          <p className="text-[10px] text-amber-600 font-bold">Requires instructor reply</p>
        </div>
      </div>

      {/* AI Summary & Action Items Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Key Topic Breakdown & Roadblocks */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">AI Topic & Roadblock Breakdown</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-900 font-bold">
                  {isCoding
                    ? 'React 19 Server Actions & Mutation State'
                    : isQuran
                    ? 'Tajweed: Makhraj of Heavy Letters (ض, ط, ق)'
                    : isSchool
                    ? 'Calculus: Taylor Series & Radius of Convergence'
                    : 'Module 3: Core Frameworks & Practical Analysis'}
                </span>
                <span className="text-blue-600 font-mono text-[11px]">42 questions (38%)</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {isCoding
                  ? 'Students frequently asked about rollback strategies and optimistic state updates during async mutations.'
                  : isQuran
                  ? 'Multiple students requested oral audio loop demonstrations on proper tongue elevation and Makhraj alignment.'
                  : isSchool
                  ? 'Students requested step-by-step demonstrations on radius of convergence and integral test derivations.'
                  : 'Students asked for detailed walkthroughs of real-world case studies and diagnostic frameworks.'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-900 font-bold">
                  {isCoding
                    ? 'TypeScript Generic Constraints'
                    : isQuran
                    ? 'Sanad Certification & Muraja\'ah Schedules'
                    : isSchool
                    ? 'Advanced Placement Honors Lab Reports'
                    : 'Capstone Projects & Executive Certification'}
                </span>
                <span className="text-emerald-600 font-mono text-[11px]">28 inquiries (25%)</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {isCoding
                  ? 'Inquiries regarding narrowing types and discriminated union patterns in component props.'
                  : isQuran
                  ? 'Prospective students inquiring about evening track availability and verified teacher chains of transmission.'
                  : isSchool
                  ? 'Inquiries regarding honors grading rubrics and college credit preparation tracks.'
                  : 'Inquiries regarding flexible evening cohorts and accredited certification requirements.'}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Generated Instructor Action Items */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Recommended Teacher Action Items</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-950">
                  {isCoding
                    ? 'Dedicate 10 minutes in next live session to Server Action error handling.'
                    : isQuran
                    ? 'Demonstrate Surah Al-Mulk Ayahs 10-15 oral recitation in the next Halaqah.'
                    : isSchool
                    ? 'Dedicate 10 minutes in next lecture to Taylor series error bound proofs.'
                    : 'Dedicate 10 minutes in next live session to Module 3 practical case studies.'}
                </p>
                <span className="text-[10px] text-emerald-700">Generated from 8 student chat requests</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-950">
                  {isCoding
                    ? 'Upload TypeScript sandbox starter template to student repository downloads.'
                    : isQuran
                    ? 'Publish Tajweed reference cheat-sheet for Ikhfaa and Idghaam rules.'
                    : isSchool
                    ? 'Upload problem set solutions and chemistry lab formula reference sheet.'
                    : 'Upload reference workbook and standard operating procedure template to resources.'}
                </p>
                <span className="text-[10px] text-blue-700">Helps resolve 14 pending student questions</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">Follow up with 2 pending admissions inquiries via WhatsApp.</p>
                <span className="text-[10px] text-amber-700">Prospective families ready to finalize enrollment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Chat Message Collection Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chat messages, topics, students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">All Channels</option>
              <option value="Live Classroom">Live Classroom</option>
              <option value="Admissions Helpdesk">Admissions Helpdesk</option>
              <option value="Student Forum">Student Forum</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Channel & Time</th>
                <th className="py-3.5 px-4">Student / Sender</th>
                <th className="py-3.5 px-4">Message Content</th>
                <th className="py-3.5 px-4">Topic Category</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredMessages.map((msg) => (
                <tr key={msg.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-900 block">{msg.channel}</span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{msg.senderName}</div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      msg.senderRole === 'teacher' ? 'bg-purple-100 text-purple-800' : msg.senderRole === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {msg.senderRole}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <p className="text-slate-800 text-xs leading-relaxed">{msg.message}</p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-mono text-[10px]">
                      #{msg.topicTag}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => toggleResolved(msg.id)}
                      className="cursor-pointer"
                    >
                      {msg.resolved ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Answered
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                          <HelpCircle className="w-2.5 h-2.5" /> Needs Reply
                        </span>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
