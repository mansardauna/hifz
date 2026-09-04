import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { Card, Badge, Button } from '../../components/ui';

interface ScheduleSlot {
  period: number;
  timeRange: string;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  room: string;
  color: string;
}

const WEEK_SCHEDULE: Record<string, ScheduleSlot[]> = {
  Monday: [
    { period: 1, timeRange: '08:30 - 09:45 AM', courseCode: 'MATH-401', courseTitle: 'AP Calculus BC', instructor: 'Dr. Eleanor Vance', room: 'Hall B-204', color: 'bg-purple-100 text-purple-900 border-purple-200' },
    { period: 2, timeRange: '10:00 - 11:15 AM', courseCode: 'PHYS-302', courseTitle: 'AP Physics C Mechanics', instructor: 'Prof. Marcus Brody', room: 'Science Lab 102', color: 'bg-blue-100 text-blue-900 border-blue-200' },
    { period: 3, timeRange: '11:30 - 12:45 PM', courseCode: 'ENGL-301', courseTitle: 'World Literature', instructor: 'Dr. Clara Sterling', room: 'Humanities 305', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
    { period: 4, timeRange: '01:30 - 02:45 PM', courseCode: 'CHEM-205', courseTitle: 'Honors Chemistry', instructor: 'Dr. Julian Thorne', room: 'Chem Lab B-12', color: 'bg-amber-100 text-amber-900 border-amber-200' },
  ],
  Tuesday: [
    { period: 1, timeRange: '09:00 - 10:15 AM', courseCode: 'HIST-210', courseTitle: 'AP World History', instructor: 'Mr. Arthur Pendelton', room: 'East Wing 210', color: 'bg-rose-100 text-rose-900 border-rose-200' },
    { period: 2, timeRange: '10:30 - 11:45 AM', courseCode: 'PHYS-302', courseTitle: 'Physics C Lab & Workshop', instructor: 'Prof. Marcus Brody', room: 'Science Lab 102', color: 'bg-blue-100 text-blue-900 border-blue-200' },
    { period: 3, timeRange: '01:00 - 02:15 PM', courseCode: 'MATH-401', courseTitle: 'Calculus BC Problem Session', instructor: 'Dr. Eleanor Vance', room: 'Hall B-204', color: 'bg-purple-100 text-purple-900 border-purple-200' },
  ],
  Wednesday: [
    { period: 1, timeRange: '08:30 - 09:45 AM', courseCode: 'MATH-401', courseTitle: 'AP Calculus BC', instructor: 'Dr. Eleanor Vance', room: 'Hall B-204', color: 'bg-purple-100 text-purple-900 border-purple-200' },
    { period: 2, timeRange: '10:00 - 11:15 AM', courseCode: 'PHYS-302', courseTitle: 'AP Physics C Mechanics', instructor: 'Prof. Marcus Brody', room: 'Science Lab 102', color: 'bg-blue-100 text-blue-900 border-blue-200' },
    { period: 3, timeRange: '11:30 - 12:45 PM', courseCode: 'ENGL-301', courseTitle: 'World Literature & Rhetoric', instructor: 'Dr. Clara Sterling', room: 'Humanities 305', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
    { period: 4, timeRange: '01:30 - 02:45 PM', courseCode: 'CHEM-205', courseTitle: 'Honors Chemistry Lab', instructor: 'Dr. Julian Thorne', room: 'Chem Lab B-12', color: 'bg-amber-100 text-amber-900 border-amber-200' },
  ],
  Thursday: [
    { period: 1, timeRange: '09:00 - 10:15 AM', courseCode: 'HIST-210', courseTitle: 'AP World History', instructor: 'Mr. Arthur Pendelton', room: 'East Wing 210', color: 'bg-rose-100 text-rose-900 border-rose-200' },
    { period: 2, timeRange: '10:30 - 11:45 AM', courseCode: 'CHEM-205', courseTitle: 'Honors Chemistry Lecture', instructor: 'Dr. Julian Thorne', room: 'Chem Lab B-12', color: 'bg-amber-100 text-amber-900 border-amber-200' },
    { period: 3, timeRange: '01:00 - 02:30 PM', courseCode: 'ENGL-301', courseTitle: 'Literature Seminar & Essays', instructor: 'Dr. Clara Sterling', room: 'Humanities 305', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
  ],
  Friday: [
    { period: 1, timeRange: '08:30 - 09:45 AM', courseCode: 'MATH-401', courseTitle: 'AP Calculus BC Exam Review', instructor: 'Dr. Eleanor Vance', room: 'Hall B-204', color: 'bg-purple-100 text-purple-900 border-purple-200' },
    { period: 2, timeRange: '10:00 - 11:15 AM', courseCode: 'PHYS-302', courseTitle: 'AP Physics C Discussion', instructor: 'Prof. Marcus Brody', room: 'Science Lab 102', color: 'bg-blue-100 text-blue-900 border-blue-200' },
    { period: 3, timeRange: '11:30 - 01:00 PM', courseCode: 'ALL', courseTitle: 'All-School Assembly & Advising', instructor: 'Academic Council', room: 'Auditorium Hall', color: 'bg-slate-100 text-slate-800 border-slate-300' },
  ],
};

export const SchoolTimetableView: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Attendance & Schedule Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-purple-900 text-white border-purple-800 space-y-1">
          <span className="text-[10px] text-purple-200 uppercase font-bold tracking-wider">Overall Attendance</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono">98.6%</span>
            <span className="text-xs text-emerald-300 font-bold">Excellent Standing</span>
          </div>
          <p className="text-xs text-purple-200">88 Days Present • 1 Excused Absence • 1 Tardy</p>
        </Card>

        <Card className="p-5 bg-white border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Next Period</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">MATH-401 (Calc BC)</span>
          </div>
          <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Starts in 25 mins • Hall B-204
          </p>
        </Card>

        <Card className="p-5 bg-white border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Academic Advisor</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">Dr. Eleanor Vance</span>
          </div>
          <p className="text-xs text-slate-500">Office Hours: MWF 02:30 - 04:00 PM</p>
        </Card>
      </div>

      {/* Day Selector */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
              selectedDay === day
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule Timeline Grid */}
      <Card className="p-6 bg-white border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-700" />
            {selectedDay} Class Schedule & Bell Matrix
          </h3>
          <Badge variant="outline" className="font-mono">{WEEK_SCHEDULE[selectedDay].length} Scheduled Periods</Badge>
        </div>

        <div className="space-y-3">
          {WEEK_SCHEDULE[selectedDay].map((slot) => (
            <div
              key={slot.period}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${slot.color}`}
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/80 border border-black/10 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                  P{slot.period}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-1.5 py-0.2 rounded bg-black/10">
                      {slot.courseCode}
                    </span>
                    <h4 className="text-sm font-bold">{slot.courseTitle}</h4>
                  </div>
                  <p className="text-xs opacity-80 flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>{slot.instructor}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-medium shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/10">
                <span className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {slot.timeRange}
                </span>

                <span className="flex items-center gap-1.5 font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  {slot.room}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
