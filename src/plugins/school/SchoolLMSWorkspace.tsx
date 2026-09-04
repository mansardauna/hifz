import React, { useState } from 'react';
import {
  BookOpen,
  FileCheck2,
  Award,
  Calendar,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { SchoolCoursesView } from './SchoolCoursesView';
import { SchoolAssignmentsPortal } from './SchoolAssignmentsPortal';
import { SchoolReportCardView } from './SchoolReportCardView';
import { SchoolTimetableView } from './SchoolTimetableView';
import { ToastMessage } from '../../components/ui/Toast';

export type SchoolSubTab = 'courses' | 'assignments' | 'grades' | 'schedule';

interface SchoolLMSWorkspaceProps {
  initialTab?: SchoolSubTab;
  onAddToast?: (toast: Omit<ToastMessage, 'id'>) => void;
  onNavigateTab?: (tab: string) => void;
}

export const SchoolLMSWorkspace: React.FC<SchoolLMSWorkspaceProps> = ({
  initialTab = 'courses',
  onAddToast,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SchoolSubTab>(initialTab);

  const tabs: { id: SchoolSubTab; label: string; icon: any; count?: string }[] = [
    { id: 'courses', label: 'Academic Courses & Syllabi', icon: BookOpen, count: '5' },
    { id: 'assignments', label: 'Homework & Drop-box', icon: FileCheck2, count: '2 To Do' },
    { id: 'grades', label: 'Report Card & GPA Transcripts', icon: Award, count: '3.94 GPA' },
    { id: 'schedule', label: 'Timetable & Attendance', icon: Calendar, count: '98.6%' },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tab Pill Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto max-w-7xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? 'bg-purple-700 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-purple-800 text-purple-200' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Render Subtab View */}
      {activeSubTab === 'courses' && (
        <SchoolCoursesView
          onNavigateToTab={(tab) => {
            if (tab === 'assignments' || tab === 'grades' || tab === 'schedule') {
              setActiveSubTab(tab as SchoolSubTab);
            }
          }}
        />
      )}

      {activeSubTab === 'assignments' && (
        <SchoolAssignmentsPortal onAddToast={onAddToast} />
      )}

      {activeSubTab === 'grades' && (
        <SchoolReportCardView />
      )}

      {activeSubTab === 'schedule' && (
        <SchoolTimetableView />
      )}
    </div>
  );
};
