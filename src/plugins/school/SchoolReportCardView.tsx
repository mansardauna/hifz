import React from 'react';
import {
  Award,
  GraduationCap,
  Download,
  TrendingUp,
  CheckCircle2,
  FileCheck,
  Star,
  Printer,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { Button, Card, Badge } from '../../components/ui';

export interface CourseGradeRecord {
  code: string;
  name: string;
  department: string;
  credits: number;
  midtermGrade: number;
  finalExamGrade: number;
  overallScore: number;
  letterGrade: string;
  honorPoints: number;
  status: 'Completed' | 'In Progress';
  teacherRemarks: string;
}

const TERM_RECORDS: CourseGradeRecord[] = [
  {
    code: 'MATH-401',
    name: 'AP Calculus BC & Differential Equations',
    department: 'Mathematics',
    credits: 4.0,
    midtermGrade: 96,
    finalExamGrade: 95,
    overallScore: 95.8,
    letterGrade: 'A',
    honorPoints: 4.0,
    status: 'In Progress',
    teacherRemarks: 'Exhibits exceptional analytical rigor and flawless mastery of series expansions.'
  },
  {
    code: 'PHYS-302',
    name: 'AP Physics C: Mechanics & Electromagnetism',
    department: 'Physical Sciences',
    credits: 4.0,
    midtermGrade: 99,
    finalExamGrade: 97,
    overallScore: 98.2,
    letterGrade: 'A+',
    honorPoints: 4.0,
    status: 'In Progress',
    teacherRemarks: 'Top scorer in class on mechanics laboratory derivations and differential models.'
  },
  {
    code: 'ENGL-301',
    name: 'World Literature & Critical Rhetoric',
    department: 'Humanities & Arts',
    credits: 3.0,
    midtermGrade: 90,
    finalExamGrade: 93,
    overallScore: 91.5,
    letterGrade: 'A-',
    honorPoints: 3.7,
    status: 'In Progress',
    teacherRemarks: 'Thoughtful rhetorical analyses and strong synthesis of modernist literature.'
  },
  {
    code: 'CHEM-205',
    name: 'Honors Organic & General Chemistry',
    department: 'Chemical Sciences',
    credits: 4.0,
    midtermGrade: 94,
    finalExamGrade: 94,
    overallScore: 94.0,
    letterGrade: 'A',
    honorPoints: 4.0,
    status: 'In Progress',
    teacherRemarks: 'Consistent high precision on calorimetry data and enthalpy calculations.'
  },
  {
    code: 'HIST-210',
    name: 'AP World History: Modern Institutions',
    department: 'Social Sciences',
    credits: 3.0,
    midtermGrade: 98,
    finalExamGrade: 97,
    overallScore: 97.4,
    letterGrade: 'A+',
    honorPoints: 4.0,
    status: 'In Progress',
    teacherRemarks: 'Flawless DBQ historical contextualization and nuanced comparative argumentation.'
  }
];

export const SchoolReportCardView: React.FC = () => {
  const totalCredits = TERM_RECORDS.reduce((acc, c) => acc + c.credits, 0);
  const weightedGpa = (
    TERM_RECORDS.reduce((acc, c) => acc + (c.honorPoints + 0.5) * c.credits, 0) / totalCredits
  ).toFixed(2);
  const unweightedGpa = (
    TERM_RECORDS.reduce((acc, c) => acc + c.honorPoints * c.credits, 0) / totalCredits
  ).toFixed(2);

  const handlePrintTranscript = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Academic Distinction Card */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-purple-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                Principal's High Honor Roll
              </span>
              <span className="text-xs text-purple-200 font-mono">Academic Standing: Top 2%</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Official Gradebook & Academic Transcript
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Official academic performance report, weighted and unweighted GPA metrics, earned credit hours, and faculty evaluation summaries.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintTranscript}
              leftIcon={<Printer className="w-4 h-4" />}
              className="text-white border-purple-400/40 bg-white/10 hover:bg-white/20 font-bold"
            >
              Print / Save PDF
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert('Downloading signed official transcript verification bundle...')}
              leftIcon={<Download className="w-4 h-4" />}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
            >
              Download Official PDF
            </Button>
          </div>
        </div>
      </div>

      {/* GPA & Credit Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5 bg-white border-slate-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Weighted GPA</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-900 font-mono">{weightedGpa}</span>
            <span className="text-xs font-bold text-slate-400">/ 5.0 scale</span>
          </div>
          <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> AP & Honors Weighted (+0.5)
          </p>
        </Card>

        <Card className="p-4 sm:p-5 bg-white border-slate-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Unweighted GPA</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{unweightedGpa}</span>
            <span className="text-xs font-bold text-slate-400">/ 4.0 scale</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Straight-A Cumulative Standard</p>
        </Card>

        <Card className="p-4 sm:p-5 bg-white border-slate-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Class Rank</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">#4</span>
            <span className="text-xs font-bold text-slate-400">of 185 Students</span>
          </div>
          <p className="text-[10px] text-purple-700 font-bold">Top 2.1% Percentile</p>
        </Card>

        <Card className="p-4 sm:p-5 bg-white border-slate-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Credits Earned</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">18.0</span>
            <span className="text-xs font-bold text-slate-400">/ 24.0 Required</span>
          </div>
          <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> On Track for Honors Diploma
          </p>
        </Card>
      </div>

      {/* Official Term Transcript Table */}
      <Card className="p-6 bg-white border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-700" />
              Fall Term 2025–2026 Academic Records
            </h3>
            <p className="text-xs text-slate-500">Verified by Office of the Registrar & Academic Affairs.</p>
          </div>
          <Badge variant="success" className="font-mono text-xs">Official & Verified</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                <th className="py-3 px-3">Course Code</th>
                <th className="py-3 px-4">Subject & Course Title</th>
                <th className="py-3 px-3 text-center">Credits</th>
                <th className="py-3 px-3 text-center">Midterm</th>
                <th className="py-3 px-3 text-center">Final</th>
                <th className="py-3 px-3 text-center">Overall</th>
                <th className="py-3 px-3 text-center">Letter Grade</th>
                <th className="py-3 px-4">Faculty Evaluation Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TERM_RECORDS.map((rec) => (
                <tr key={rec.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-purple-900 whitespace-nowrap">
                    {rec.code}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                    <div>{rec.name}</div>
                    <span className="text-[10px] text-slate-400 font-normal">{rec.department}</span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                    {rec.credits.toFixed(1)}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-700">
                    {rec.midtermGrade}%
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-700">
                    {rec.finalExamGrade}%
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900">
                    {rec.overallScore}%
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2.5 py-1 rounded-md font-black font-mono text-xs ${
                      rec.letterGrade.startsWith('A')
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}>
                      {rec.letterGrade}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-[11px] leading-relaxed max-w-sm">
                    {rec.teacherRemarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
