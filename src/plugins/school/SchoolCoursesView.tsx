import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Clock,
  User,
  MapPin,
  FileText,
  Download,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../../components/ui';

export interface SchoolCourse {
  id: string;
  code: string;
  title: string;
  department: string;
  instructor: string;
  instructorRole: string;
  instructorEmail: string;
  room: string;
  schedule: string;
  credits: number;
  gradeToDate: string;
  gradePercent: number;
  currentUnit: string;
  progressPercent: number;
  color: string;
  syllabus: {
    unit: string;
    topics: string[];
    completed: boolean;
  }[];
  materials: {
    id: string;
    title: string;
    type: 'PDF' | 'Slides' | 'Lab Sheet' | 'Reading';
    size: string;
    date: string;
  }[];
}

const INITIAL_SCHOOL_COURSES: SchoolCourse[] = [
  {
    id: 'course-calc',
    code: 'MATH-401',
    title: 'AP Calculus BC & Differential Equations',
    department: 'Mathematics',
    instructor: 'Dr. Eleanor Vance',
    instructorRole: 'Mathematics Department Chair',
    instructorEmail: 'e.vance@school.edu',
    room: 'Hall B-204',
    schedule: 'Mon, Wed, Fri • 08:30 AM - 09:45 AM',
    credits: 4.0,
    gradeToDate: 'A',
    gradePercent: 95.8,
    currentUnit: 'Unit 5: Taylor & Maclaurin Series Expansions',
    progressPercent: 68,
    color: 'emerald',
    syllabus: [
      { unit: 'Unit 1: Limits & Continuity Theorems', topics: ['Epsilon-Delta proofs', 'Squeeze Theorem', 'Intermediate Value Theorem'], completed: true },
      { unit: 'Unit 2: Advanced Differentiation & Related Rates', topics: ['Implicit differentiation', 'Parametric curves', 'Optimization'], completed: true },
      { unit: 'Unit 3: Riemann Sums & Fundamental Theorem of Calculus', topics: ['Definite integrals', 'Accumulation functions'], completed: true },
      { unit: 'Unit 4: Integration Techniques & Partial Fractions', topics: ['Integration by parts', 'Trig substitution', 'Improper integrals'], completed: true },
      { unit: 'Unit 5: Infinite Sequences & Power Series', topics: ['Ratio test', 'Radius of convergence', 'Taylor polynomials'], completed: false },
      { unit: 'Unit 6: First-Order Differential Equations', topics: ['Separable equations', 'Slope fields', 'Euler method'], completed: false },
    ],
    materials: [
      { id: 'mat-1', title: 'Chapter 5 Lecture Slides - Taylor Polynomials.pdf', type: 'Slides', size: '3.4 MB', date: 'Yesterday' },
      { id: 'mat-2', title: 'Calculus BC Formula Sheet & Series Cheat Sheet.pdf', type: 'PDF', size: '1.1 MB', date: 'Oct 14' },
      { id: 'mat-3', title: 'Problem Set 5 Selected Solutions.pdf', type: 'PDF', size: '820 KB', date: 'Oct 10' },
    ]
  },
  {
    id: 'course-phys',
    code: 'PHYS-302',
    title: 'AP Physics C: Mechanics & Electromagnetism',
    department: 'Physical Sciences',
    instructor: 'Prof. Marcus Brody',
    instructorRole: 'Lead Physics Faculty',
    instructorEmail: 'm.brody@school.edu',
    room: 'Science Wing Lab 102',
    schedule: 'Tue, Thu • 10:00 AM - 11:30 AM',
    credits: 4.0,
    gradeToDate: 'A+',
    gradePercent: 98.2,
    currentUnit: 'Unit 4: Rotational Dynamics & Angular Momentum',
    progressPercent: 72,
    color: 'blue',
    syllabus: [
      { unit: 'Unit 1: 1D & 2D Kinematics with Calculus', topics: ['Position vectors', 'Projectile trajectory derivations'], completed: true },
      { unit: 'Unit 2: Newton\'s Laws & Drag Forces', topics: ['Terminal velocity ODEs', 'Friction coefficients'], completed: true },
      { unit: 'Unit 3: Work-Energy Theorem & Conservative Systems', topics: ['Potential energy curves', 'Non-conservative work'], completed: true },
      { unit: 'Unit 4: Systems of Particles & Angular Momentum', topics: ['Center of mass', 'Moment of inertia tensors', 'Torque vectors'], completed: false },
      { unit: 'Unit 5: Simple Harmonic Motion & Pendulums', topics: ['Torsional oscillators', 'Damped harmonic motion'], completed: false },
    ],
    materials: [
      { id: 'mat-4', title: 'Lab 4 Guide - Moment of Inertia of Rigid Bodies.pdf', type: 'Lab Sheet', size: '2.1 MB', date: '2 days ago' },
      { id: 'mat-5', title: 'Physics C Rotational Dynamics Lecture Notes.pdf', type: 'PDF', size: '4.8 MB', date: 'Oct 12' },
    ]
  },
  {
    id: 'course-lit',
    code: 'ENGL-301',
    title: 'World Literature & Critical Rhetoric',
    department: 'Humanities & Arts',
    instructor: 'Dr. Clara Sterling',
    instructorRole: 'Associate Professor of Literature',
    instructorEmail: 'c.sterling@school.edu',
    room: 'Humanities Hall 305',
    schedule: 'Mon, Wed • 11:00 AM - 12:15 PM',
    credits: 3.0,
    gradeToDate: 'A-',
    gradePercent: 91.5,
    currentUnit: 'Unit 3: Post-Colonial Narratives & Allegory',
    progressPercent: 60,
    color: 'purple',
    syllabus: [
      { unit: 'Unit 1: Classical Tragedies & Dramatic Structure', topics: ['Aristotelian poetics', 'Hamartia and Catharsis in Oedipus'], completed: true },
      { unit: 'Unit 2: The Enlightenment & Philosophical Fiction', topics: ['Voltaire and Swift', 'Satire as political critique'], completed: true },
      { unit: 'Unit 3: Modernist Allegory & Stream of Consciousness', topics: ['Kafka & Joyce', 'Existential motifs in 20th Century literature'], completed: false },
      { unit: 'Unit 4: Comparative Rhetoric & Academic Essays', topics: ['Thesis construction', 'Peer review', 'Source synthesis'], completed: false },
    ],
    materials: [
      { id: 'mat-6', title: 'Critical Essay Prompt 2 - Modernist Themes.pdf', type: 'Reading', size: '650 KB', date: 'Oct 15' },
      { id: 'mat-7', title: 'MLA 9th Edition Citation Handbook.pdf', type: 'PDF', size: '1.5 MB', date: 'Sep 28' },
    ]
  },
  {
    id: 'course-chem',
    code: 'CHEM-205',
    title: 'Honors Organic & General Chemistry',
    department: 'Chemical Sciences',
    instructor: 'Dr. Julian Thorne',
    instructorRole: 'Senior Chemistry Faculty',
    instructorEmail: 'j.thorne@school.edu',
    room: 'Chemistry Lab B-12',
    schedule: 'Mon, Wed, Fri • 01:00 PM - 02:00 PM',
    credits: 4.0,
    gradeToDate: 'A',
    gradePercent: 94.0,
    currentUnit: 'Unit 4: Thermochemistry & Gibbs Free Energy',
    progressPercent: 65,
    color: 'amber',
    syllabus: [
      { unit: 'Unit 1: Atomic Structure & Periodicity', topics: ['Quantum numbers', 'Electron configurations', 'Electronegativity'], completed: true },
      { unit: 'Unit 2: Chemical Bonding & Molecular Geometry', topics: ['VSEPR theory', 'Hybridization', 'Intermolecular forces'], completed: true },
      { unit: 'Unit 3: Reaction Kinetics & Rate Laws', topics: ['Arrhenius equation', 'Reaction mechanisms', 'Catalysis'], completed: true },
      { unit: 'Unit 4: Chemical Thermodynamics & Equilibrium', topics: ['Enthalpy', 'Entropy', 'Equilibrium constant calculations'], completed: false },
    ],
    materials: [
      { id: 'mat-8', title: 'Lab Experiment 5 - Calorimetry and Enthalpy of Neutralization.pdf', type: 'Lab Sheet', size: '1.9 MB', date: '3 days ago' },
      { id: 'mat-9', title: 'Thermodynamics Unit Review Problems.pdf', type: 'PDF', size: '920 KB', date: 'Oct 08' },
    ]
  },
  {
    id: 'course-hist',
    code: 'HIST-210',
    title: 'AP World History: Modern Global Institutions',
    department: 'Social Sciences',
    instructor: 'Mr. Arthur Pendelton',
    instructorRole: 'Lead History Faculty',
    instructorEmail: 'a.pendelton@school.edu',
    room: 'East Wing 210',
    schedule: 'Tue, Thu • 01:30 PM - 03:00 PM',
    credits: 3.0,
    gradeToDate: 'A+',
    gradePercent: 97.4,
    currentUnit: 'Unit 5: Revolutions & Industrial Transformations (1750-1900)',
    progressPercent: 75,
    color: 'rose',
    syllabus: [
      { unit: 'Unit 1: The Global Tapestry (1200-1450)', topics: ['Song Dynasty developments', 'Islamic Golden Age dar al-Islam'], completed: true },
      { unit: 'Unit 2: Networks of Exchange (1200-1450)', topics: ['Silk Roads', 'Indian Ocean Trade', 'Trans-Saharan Routes'], completed: true },
      { unit: 'Unit 3: Land-Based Empires (1450-1750)', topics: ['Ottoman, Safavid, Mughal, Ming and Qing empires'], completed: true },
      { unit: 'Unit 4: Transoceanic Interconnections (1450-1750)', topics: ['Columbian Exchange', 'Maritime trade empires'], completed: true },
      { unit: 'Unit 5: Revolutions & Industrialization', topics: ['Enlightenment philosophy', 'Industrial growth', 'Nationalism'], completed: false },
    ],
    materials: [
      { id: 'mat-10', title: 'Primary Source Reader - The Industrial Revolution.pdf', type: 'Reading', size: '2.8 MB', date: 'Oct 14' },
      { id: 'mat-11', title: 'DBQ Writing Rubric & Guidelines.pdf', type: 'PDF', size: '750 KB', date: 'Sep 20' },
    ]
  }
];

interface SchoolCoursesViewProps {
  onSelectCourse?: (courseId: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const SchoolCoursesView: React.FC<SchoolCoursesViewProps> = ({ onSelectCourse, onNavigateToTab }) => {
  const [courses] = useState<SchoolCourse[]>(INITIAL_SCHOOL_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<SchoolCourse | null>(INITIAL_SCHOOL_COURSES[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('All');

  const departments = ['All', 'Mathematics', 'Physical Sciences', 'Humanities & Arts', 'Chemical Sciences', 'Social Sciences'];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || c.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Summary Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-purple-700/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Academic Term 2025–2026
              </span>
              <span className="text-xs text-slate-300 font-mono">5 Enrolled Courses • 18.0 Credits</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Academic Courses & Interactive Syllabi
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Access your lecture notes, downloadable slide decks, class schedules, and follow weekly unit mastery across all your academic subjects.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 text-center min-w-[110px]">
              <span className="text-[10px] text-purple-200 uppercase font-bold tracking-wider block">Current Term GPA</span>
              <span className="text-2xl font-black text-white font-mono">3.94</span>
              <span className="text-[10px] text-emerald-300 font-bold block">4.0 Scale</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 text-center min-w-[110px]">
              <span className="text-[10px] text-purple-200 uppercase font-bold tracking-wider block">Completed Units</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">16 / 24</span>
              <span className="text-[10px] text-slate-300 font-bold block">67% Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search course title, code or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                selectedDept === dept
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Courses List & Course Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Course Cards */}
        <div className="lg:col-span-5 space-y-3.5">
          {filteredCourses.map((course) => {
            const isSelected = selectedCourse?.id === course.id;
            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none relative ${
                  isSelected
                    ? 'bg-white border-purple-600 shadow-md ring-2 ring-purple-600/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                        {course.code}
                      </span>
                      <span className="text-[11px] text-slate-500">{course.department}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">
                      {course.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Grade: {course.gradeToDate} ({course.gradePercent}%)
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 font-medium text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.credits} Credits</span>
                  </div>
                </div>

                {/* Mini Progress Bar */}
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span>{course.currentUnit}</span>
                    <span className="font-bold">{course.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Course In-Depth Hub */}
        <div className="lg:col-span-7">
          {selectedCourse ? (
            <Card className="p-6 space-y-6 bg-white border-slate-200">
              {/* Course Title Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary">{selectedCourse.code}</Badge>
                    <Badge variant="outline">{selectedCourse.department}</Badge>
                    <span className="text-xs font-mono text-slate-500">{selectedCourse.credits} Credits</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    {selectedCourse.title}
                  </h2>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedCourse.room}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedCourse.schedule}</span>
                  </p>
                </div>

                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-center shrink-0 min-w-[100px]">
                  <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider block">Course Grade</span>
                  <span className="text-2xl font-black text-purple-900 font-mono">{selectedCourse.gradeToDate}</span>
                  <span className="text-[11px] text-purple-700 font-bold block">{selectedCourse.gradePercent}%</span>
                </div>
              </div>

              {/* Instructor Information Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-700 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {selectedCourse.instructor.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{selectedCourse.instructor}</h4>
                    <p className="text-xs text-slate-500">{selectedCourse.instructorRole}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedCourse.instructorEmail}`}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Office Hours</span>
                  </a>
                </div>
              </div>

              {/* Unit Syllabus Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    Unit Syllabi & Curriculum Milestones
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">{selectedCourse.progressPercent}% Completed</span>
                </div>

                <div className="space-y-2">
                  {selectedCourse.syllabus.map((unit, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                        unit.completed
                          ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                        unit.completed ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300'
                      }`}>
                        {unit.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs font-bold ${unit.completed ? 'text-emerald-950 font-bold' : 'text-slate-900'}`}>
                            {unit.unit}
                          </p>
                          {unit.completed && (
                            <Badge variant="success" className="text-[10px]">Passed</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {unit.topics.map((topic, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-medium"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Handouts & Downloadable Materials */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Lecture Slide Decks & Reference Worksheets
                </h4>

                <div className="space-y-2">
                  {selectedCourse.materials.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {mat.type === 'PDF' ? 'PDF' : mat.type === 'Slides' ? 'PPT' : 'DOC'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{mat.title}</p>
                          <p className="text-[10px] text-slate-500">{mat.size} • Uploaded {mat.date}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Downloading handout: ${mat.title}`)}
                        className="p-2 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-white border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                        title="Download Material"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-600">Select an academic course to view syllabus</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
