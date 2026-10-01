import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useToast } from '../../context/ToastContext';
import {
  Layout,
  Plus,
  Eye,
  Save,
  Trash2,
  MoveUp,
  MoveDown,
  Palette,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  Sliders,
  Image as ImageIcon,
  Type,
  ExternalLink,
  BookOpen,
  Code2,
  Hammer,
  CreditCard,
  FileText,
  Users,
  MessageSquare,
  HelpCircle,
  Zap,
  Check,
  Globe,
  GraduationCap
} from 'lucide-react';
import { Button, Input, Card, Badge, Modal } from '../ui';

export interface PageSectionBlock {
  id: string;
  type: 'hero' | 'features' | 'curriculum' | 'pricing' | 'form' | 'instructors' | 'testimonials' | 'faq' | 'cta';
  title: string;
  subtitle?: string;
  enabled: boolean;
  props: Record<string, any>;
}

export interface ThemePreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  colorScheme: string;
  sections: PageSectionBlock[];
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  quran: {
    id: 'quran',
    name: 'Quran & Islamic Madrasah',
    icon: '📖',
    description: 'Authentic Islamic Tajweed & Hifz with Sanad chain verification and sacred calligraphy motifs.',
    colorScheme: 'Emerald & Gold',
    sections: [
      {
        id: 'sec-hero-quran',
        type: 'hero',
        title: 'Master Quranic Recitation & Tajweed with Certified Scholars',
        subtitle: 'Live 1-on-1 and group halaqat with verified Sanad chains connected to the Prophet Muhammad ﷺ.',
        enabled: true,
        props: {
          badgeText: 'Verified Ijazah Programs',
          ctaText: 'Enroll in Free Trial',
          ctaLink: '#pricing',
          secondaryCtaText: 'Admissions Inquiry',
          secondaryCtaLink: '#form',
          bgGradient: 'from-emerald-950 via-teal-900 to-slate-950',
          imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80',
        },
      },
      {
        id: 'sec-feat-quran',
        type: 'features',
        title: 'Why Study at Our Sacred Halaqah',
        subtitle: 'Combining classical Islamic pedagogy with cutting-edge audio technology and individual recitation logs.',
        enabled: true,
        props: {
          items: [
            { icon: 'Award', title: 'Authentic Sanad Chains', desc: 'Direct unbroken recitation chains in Hafs, Warsh, and Qaloon.' },
            { icon: 'Radio', title: 'Live Interactive WebRTC', desc: 'Crystal-clear audio-first virtual classrooms with audio looper.' },
            { icon: 'CheckCircle2', title: 'Flexible Global Cohorts', desc: 'Morning and evening cohorts tailored to your local timezone.' },
          ],
        },
      },
      {
        id: 'sec-curriculum-quran',
        type: 'curriculum',
        title: 'Structured Hifz & Tajweed Tracks',
        subtitle: 'From foundational Arabic phonetics to complete 30-Juz memorization and Sanad mastery.',
        enabled: true,
        props: {
          showEnrollBtn: true,
        },
      },
      {
        id: 'sec-pricing-quran',
        type: 'pricing',
        title: 'Tuition & Subscription Plans',
        subtitle: 'Affordable monthly and yearly tuition packages with certified mentor guidance.',
        enabled: true,
        props: {
          showAnnualToggle: true,
        },
      },
      {
        id: 'sec-form-quran',
        type: 'form',
        title: 'Direct Admissions & Placement Evaluation',
        subtitle: 'Submit your application for immediate review and voice assessment scheduling.',
        enabled: true,
        props: {
          selectedFormId: 'form-admissions',
        },
      },
      {
        id: 'sec-faq-quran',
        type: 'faq',
        title: 'Frequently Asked Questions',
        subtitle: 'Everything you need to know about our curriculum, class times, and teacher qualifications.',
        enabled: true,
        props: {
          questions: [
            { q: 'What qualifications do your instructors hold?', a: 'All our instructors possess verified Ijazahs with unbroken chains (Sanad) to the Prophet ﷺ and have graduated from prestigious Islamic institutions.' },
            { q: 'Can children enroll in the foundational classes?', a: 'Yes! We have specialized youth cohorts for ages 6+ starting with Noorani Qaidah and basic Tajweed rules.' },
            { q: 'Are sessions recorded for later review?', a: 'Yes, all live halaqat are logged in your student dashboard for continuous repetition.' }
          ],
        },
      },
    ],
  },
  coding: {
    id: 'coding',
    name: 'Coding & Software Engineering',
    icon: '💻',
    description: 'FreeCodeCamp-style browser IDE challenge runner, real-time assertions, and full-stack projects.',
    colorScheme: 'Indigo & Dark Cyber',
    sections: [
      {
        id: 'sec-hero-code',
        type: 'hero',
        title: 'Master Full-Stack Development with Live Interactive Challenges',
        subtitle: 'Build production software, master algorithmic data structures, and pass automated unit test suites.',
        enabled: true,
        props: {
          badgeText: 'Next-Gen Developer Training',
          ctaText: 'Start Free Coding Sandbox',
          ctaLink: '#curriculum',
          secondaryCtaText: 'View Pricing',
          secondaryCtaLink: '#pricing',
          bgGradient: 'from-slate-950 via-blue-950 to-indigo-950',
          imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        },
      },
      {
        id: 'sec-feat-code',
        type: 'features',
        title: 'Hands-On Coding Pedagogy',
        subtitle: 'Zero local setup required — write, debug, and run code directly in your browser with automated CI assertions.',
        enabled: true,
        props: {
          items: [
            { icon: 'Code2', title: 'Interactive Test Suites', desc: 'FreeCodeCamp-style unit assertions with instant pass/fail validation.' },
            { icon: 'Layers', title: 'Modern Tech Stack', desc: 'React, TypeScript, Next.js, Node, Python, and SQL databases.' },
            { icon: 'Users', title: 'Live Pair Programming', desc: 'Collaborate in real-time rooms with senior tech leads.' },
          ],
        },
      },
      {
        id: 'sec-curriculum-code',
        type: 'curriculum',
        title: 'Software Engineering Career Tracks',
        subtitle: 'Progressive tracks from JavaScript algorithms to production microservices and cloud deployments.',
        enabled: true,
        props: {
          showEnrollBtn: true,
        },
      },
      {
        id: 'sec-pricing-code',
        type: 'pricing',
        title: 'Bootcamp Tuition & Apprenticeships',
        subtitle: 'Transparent tuition with dedicated senior mentor code reviews and portfolio certification.',
        enabled: true,
        props: {
          showAnnualToggle: true,
        },
      },
      {
        id: 'sec-form-code',
        type: 'form',
        title: 'Bootcamp Admission & Technical Screening',
        subtitle: 'Submit your tech background and target career goal to begin your entrance assessment.',
        enabled: true,
        props: {
          selectedFormId: 'form-admissions',
        },
      },
    ],
  },
  vocational: {
    id: 'vocational',
    name: 'Vocational Trades & Practical Academy',
    icon: '🛠️',
    description: 'Hands-on practical training with step-by-step workshop checklists, photo proof submissions, and trade rubrics.',
    colorScheme: 'Slate & Amber',
    sections: [
      {
        id: 'sec-hero-voc',
        type: 'hero',
        title: 'Master Practical Craftsmanship & Vocational Trades',
        subtitle: 'Hands-on practical training with workshop checklists, certified master tradesmen, and project rubrics.',
        enabled: true,
        props: {
          badgeText: 'Accredited Vocational Diplomas',
          ctaText: 'Apply for Next Cohort',
          ctaLink: '#pricing',
          secondaryCtaText: 'Workshop Inquiries',
          secondaryCtaLink: '#form',
          bgGradient: 'from-slate-950 via-slate-900 to-amber-950',
          imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
        },
      },
      {
        id: 'sec-feat-voc',
        type: 'features',
        title: 'Practical Vocational Excellence',
        subtitle: 'Industry-standard trade curriculum with proof of craftsmanship submissions and rubric grading.',
        enabled: true,
        props: {
          items: [
            { icon: 'Hammer', title: 'Workshop Action Checklists', desc: 'Step-by-step practical guides with photo and video proof uploads.' },
            { icon: 'Award', title: 'Master Craft Review', desc: 'Personalized rubric feedback from experienced master craftsmen.' },
            { icon: 'CheckCircle2', title: 'Certified Trade Diplomas', desc: 'Shareable verified certificates upon passing practical assessments.' },
          ],
        },
      },
      {
        id: 'sec-curriculum-voc',
        type: 'curriculum',
        title: 'Trade Diplomas & Apprenticeships',
        subtitle: 'Electrical Systems, Solar PV Installation, HVAC Maintenance, Automotive Engineering, and Carpentry.',
        enabled: true,
        props: {
          showEnrollBtn: true,
        },
      },
      {
        id: 'sec-pricing-voc',
        type: 'pricing',
        title: 'Workshop Tuition & Tooling Packages',
        subtitle: 'All-inclusive enrollment covering hands-on materials, safety gear, and master evaluation.',
        enabled: true,
        props: {
          showAnnualToggle: true,
        },
      },
      {
        id: 'sec-form-voc',
        type: 'form',
        title: 'Trade Apprenticeship Application',
        subtitle: 'Apply for the upcoming practical workshop cohort at our accredited facility.',
        enabled: true,
        props: {
          selectedFormId: 'form-admissions',
        },
      },
    ],
  },
  stem_school: {
    id: 'stem_school',
    name: 'K-12 STEM & Islamic Integrated School',
    icon: '🏫',
    description: 'Comprehensive K-12 schooling fusing academic STEM excellence with noble Islamic values and character.',
    colorScheme: 'Navy & Sky Blue',
    sections: [
      {
        id: 'sec-hero-stem',
        type: 'hero',
        title: 'Empowering Future Leaders with STEM Excellence & Islamic Values',
        subtitle: 'A holistic learning environment blending modern science, robotics, language arts, and noble Akhlaq.',
        enabled: true,
        props: {
          badgeText: 'Now Enrolling Fall 2026',
          ctaText: 'Apply for Admission',
          ctaLink: '#form',
          secondaryCtaText: 'View Tuition Plans',
          secondaryCtaLink: '#pricing',
          bgGradient: 'from-slate-950 via-blue-950 to-cyan-950',
          imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
        },
      },
      {
        id: 'sec-feat-stem',
        type: 'features',
        title: 'Holistic Education for Mind & Spirit',
        subtitle: 'Modern pedagogical standards with small class cohorts and dedicated student advisory.',
        enabled: true,
        props: {
          items: [
            { icon: 'Zap', title: 'STEM & Robotics Labs', desc: 'Hands-on experimentation with coding, electronics, and applied mathematics.' },
            { icon: 'BookOpen', title: 'Arabic & Islamic Character', desc: 'Integrated Quranic morals, daily adab, and fluent Arabic fluency.' },
            { icon: 'Users', title: 'Parent Portal & Live Timetables', desc: 'Real-time grade reports, attendance tracking, and parent-teacher communication.' },
          ],
        },
      },
      {
        id: 'sec-pricing-stem',
        type: 'pricing',
        title: 'Annual & Term School Tuition',
        subtitle: 'Flexible quarterly and annual tuition schedules with sibling discounts.',
        enabled: true,
        props: {
          showAnnualToggle: true,
        },
      },
      {
        id: 'sec-form-stem',
        type: 'form',
        title: 'New Student Admission & Assessment Registration',
        subtitle: 'Begin the enrollment process for your child for the upcoming academic year.',
        enabled: true,
        props: {
          selectedFormId: 'form-admissions',
        },
      },
    ],
  },
  languages: {
    id: 'languages',
    name: 'Languages & Linguistics Institute',
    icon: '🌐',
    description: 'Classical Arabic, English, and multi-language fluency with live conversation labs.',
    colorScheme: 'Teal & Coral',
    sections: [
      {
        id: 'sec-hero-lang',
        type: 'hero',
        title: 'Achieve Fluent Language Mastery with Native Speakers',
        subtitle: 'Immersive Arabic, English, and regional languages with live conversational speaking labs.',
        enabled: true,
        props: {
          badgeText: 'CEFR Certified Tracks',
          ctaText: 'Take Placement Test',
          ctaLink: '#form',
          secondaryCtaText: 'Tuition Packages',
          secondaryCtaLink: '#pricing',
          bgGradient: 'from-teal-950 via-slate-900 to-slate-950',
          imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
        },
      },
      {
        id: 'sec-pricing-lang',
        type: 'pricing',
        title: 'Language Cohort Subscriptions',
        subtitle: 'Intensive conversational circles and 1-on-1 native tutor coaching.',
        enabled: true,
        props: {
          showAnnualToggle: true,
        },
      },
      {
        id: 'sec-form-lang',
        type: 'form',
        title: 'Placement Assessment & Level Evaluation',
        subtitle: 'Schedule your oral evaluation with our linguistics faculty.',
        enabled: true,
        props: {
          selectedFormId: 'form-admissions',
        },
      },
    ],
  },
};

export const ModularSectionPageBuilder: React.FC = () => {
  const { tenant, updateTenantConfig, language, direction } = useTenant();
  const { success, info } = useToast();

  const defaultSections = THEME_PRESETS['quran'].sections;
  const [sections, setSections] = useState<PageSectionBlock[]>(
    tenant.builderLayout?.sections && tenant.builderLayout.sections.length > 0
      ? tenant.builderLayout.sections
      : defaultSections
  );

  const [activeTemplateKey, setActiveTemplateKey] = useState<string>('quran');
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState<boolean>(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState<boolean>(false);

  const activeSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  const handleApplyTemplate = (key: string) => {
    const preset = THEME_PRESETS[key];
    if (preset) {
      setActiveTemplateKey(key);
      const cloned = JSON.parse(JSON.stringify(preset.sections));
      setSections(cloned);
      setSelectedSectionId(cloned[0]?.id || '');
      info('Theme Applied', `Loaded "${preset.name}" template with ${cloned.length} styled sections.`);
    }
  };

  const handleToggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleMoveSection = (index: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    setSections(reordered);
  };

  const handleDeleteSection = (id: string) => {
    if (sections.length <= 1) {
      info('Notice', 'You must have at least one section on your page.');
      return;
    }
    const filtered = sections.filter((s) => s.id !== id);
    setSections(filtered);
    if (selectedSectionId === id) {
      setSelectedSectionId(filtered[0]?.id || '');
    }
  };

  const handleAddSection = (type: PageSectionBlock['type']) => {
    const newId = `sec-${type}-${Date.now()}`;
    let newSection: PageSectionBlock = {
      id: newId,
      type,
      title: type === 'pricing' ? 'Tuition & Pricing Plans' : type === 'curriculum' ? 'Featured Learning Tracks' : type === 'form' ? 'Admissions & Inquiries' : type === 'faq' ? 'Frequently Asked Questions' : 'New Section Block',
      subtitle: 'Customize this block to showcase your academy offerings.',
      enabled: true,
      props: {},
    };

    if (type === 'hero') {
      newSection.props = {
        badgeText: 'New Program',
        ctaText: 'Enroll Now',
        ctaLink: '#pricing',
        bgGradient: 'from-slate-950 via-slate-900 to-emerald-950',
      };
    } else if (type === 'pricing') {
      newSection.props = { showAnnualToggle: true };
    } else if (type === 'form') {
      newSection.props = { selectedFormId: tenant.forms?.[0]?.id || 'form-admissions' };
    }

    setSections((prev) => [...prev, newSection]);
    setSelectedSectionId(newId);
    setIsAddSectionModalOpen(false);
    success('Block Added', `Added new ${type} section.`);
  };

  const handleSaveLayout = () => {
    updateTenantConfig({
      builderLayout: {
        sections,
        lastUpdated: new Date().toISOString(),
      },
    });
    success('Landing Page Published! 🚀', 'Your modular website layout is live on your subdomain.');
  };

  return (
    <div className="space-y-6 font-sans" dir={direction}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <h2 className="text-xl font-black text-slate-900">Modern Visual Section Builder</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build high-converting, mobile-responsive landing pages without writing HTML/CSS. Reorder, customize, and publish blocks instantly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLivePreviewOpen(!isLivePreviewOpen)}
            className="text-xs font-bold"
          >
            <Eye className="w-3.5 h-3.5 mr-1 text-blue-600" />
            {isLivePreviewOpen ? 'Edit Sections' : 'Live Canvas'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveLayout}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" /> Save & Publish Live
          </Button>
        </div>
      </div>

      {/* Preset Template Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          One-Click Industry Templates (500+ Scalable Designs)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(THEME_PRESETS).map(([key, tpl]) => (
            <button
              key={key}
              onClick={() => handleApplyTemplate(key)}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col gap-1.5 transition-all cursor-pointer text-left ${
                activeTemplateKey === key
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{tpl.icon}</span>
                <span className="truncate font-extrabold">{tpl.name}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-normal line-clamp-1">{tpl.colorScheme}</span>
            </button>
          ))}
        </div>
      </div>

      {!isLivePreviewOpen ? (
        /* Section Blocks Editor Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Section Blocks Reordering & Visibility (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm h-fit">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-emerald-600" />
                <span>Page Blocks ({sections.length})</span>
              </span>

              <button
                onClick={() => setIsAddSectionModalOpen(true)}
                className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Block</span>
              </button>
            </div>

            <div className="space-y-2">
              {sections.map((section, idx) => {
                const isSelected = activeSection?.id === section.id;
                return (
                  <div
                    key={section.id}
                    onClick={() => setSelectedSectionId(section.id)}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                        : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={section.enabled}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleSection(section.id);
                        }}
                        className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <div className="truncate font-extrabold capitalize flex items-center gap-1.5">
                          {section.type === 'hero' && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                          {section.type === 'pricing' && <CreditCard className="w-3.5 h-3.5 text-blue-500" />}
                          {section.type === 'form' && <FileText className="w-3.5 h-3.5 text-purple-500" />}
                          {section.type === 'curriculum' && <BookOpen className="w-3.5 h-3.5 text-emerald-500" />}
                          <span>{section.type} Block</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{section.title}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleMoveSection(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSection(idx, 'down')}
                        disabled={idx === sections.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Section Content & Customization Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
            {activeSection ? (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {activeSection.type} Block Settings
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1">{activeSection.title}</h3>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Section Heading</label>
                  <Input
                    value={activeSection.title}
                    onChange={(e) => {
                      const updated = sections.map((s) =>
                        s.id === activeSection.id ? { ...s, title: e.target.value } : s
                      );
                      setSections(updated);
                    }}
                    placeholder="Main heading..."
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subtitle / Paragraph Description</label>
                  <textarea
                    rows={3}
                    value={activeSection.subtitle || ''}
                    onChange={(e) => {
                      const updated = sections.map((s) =>
                        s.id === activeSection.id ? { ...s, subtitle: e.target.value } : s
                      );
                      setSections(updated);
                    }}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-500"
                    placeholder="Section description..."
                  />
                </div>

                {/* Section Specific Controls */}
                {activeSection.type === 'hero' && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Top Highlight Badge</label>
                      <Input
                        value={activeSection.props.badgeText || ''}
                        onChange={(e) => {
                          const updated = sections.map((s) =>
                            s.id === activeSection.id
                              ? { ...s, props: { ...s.props, badgeText: e.target.value } }
                              : s
                          );
                          setSections(updated);
                        }}
                        placeholder="e.g. Verified Ijazah Programs"
                        className="text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">CTA Button Text</label>
                        <Input
                          value={activeSection.props.ctaText || ''}
                          onChange={(e) => {
                            const updated = sections.map((s) =>
                              s.id === activeSection.id
                                ? { ...s, props: { ...s.props, ctaText: e.target.value } }
                                : s
                            );
                            setSections(updated);
                          }}
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Hero Image URL</label>
                        <Input
                          value={activeSection.props.imageUrl || ''}
                          onChange={(e) => {
                            const updated = sections.map((s) =>
                              s.id === activeSection.id
                                ? { ...s, props: { ...s.props, imageUrl: e.target.value } }
                                : s
                            );
                            setSections(updated);
                          }}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection.type === 'pricing' && (
                  <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2 text-xs text-blue-900">
                    <div className="flex items-center gap-2 font-bold">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Live Synced Pricing Plans ({tenant.pricingPlans?.length || 0} active)</span>
                    </div>
                    <p className="text-[11px] text-blue-700">
                      The pricing cards on this block automatically reflect any additions, edits, or currency adjustments made in your <strong>Pricing Tab</strong>.
                    </p>
                  </div>
                )}

                {activeSection.type === 'form' && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-700 block">Select Embedded Custom Form</label>
                    <select
                      value={activeSection.props.selectedFormId || tenant.forms?.[0]?.id || 'form-admissions'}
                      onChange={(e) => {
                        const updated = sections.map((s) =>
                          s.id === activeSection.id
                            ? { ...s, props: { ...s.props, selectedFormId: e.target.value } }
                            : s
                        );
                        setSections(updated);
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:border-emerald-600"
                    >
                      {tenant.forms && tenant.forms.length > 0 ? (
                        tenant.forms.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.title} ({f.fields?.length || 0} fields)
                          </option>
                        ))
                      ) : (
                        <option value="form-admissions">Direct Admissions & Evaluation Inquiry</option>
                      )}
                    </select>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Layout className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">Select a section block from the left panel to customize.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Live Responsive Preview Canvas */
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 bg-slate-100 p-1.5 rounded-xl w-fit mx-auto border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                previewDevice === 'desktop' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-600'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
            <button
              onClick={() => setPreviewDevice('tablet')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                previewDevice === 'tablet' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-600'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" /> Tablet
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                previewDevice === 'mobile' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-600'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
          </div>

          <div className="flex justify-center p-4 bg-slate-200/60 rounded-3xl overflow-x-auto">
            <div
              className={`bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden transition-all duration-300 ${
                previewDevice === 'desktop' ? 'w-full max-w-5xl' : previewDevice === 'tablet' ? 'w-[768px]' : 'w-[390px]'
              }`}
            >
              {/* Mock Rendered Landing Page */}
              <div className="space-y-12 pb-16">
                {sections
                  .filter((s) => s.enabled)
                  .map((sec) => (
                    <div key={sec.id} className="p-8 sm:p-12 text-center space-y-4 border-b border-slate-100">
                      {sec.props.badgeText && (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold uppercase tracking-wider">
                          {sec.props.badgeText}
                        </span>
                      )}
                      <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight max-w-2xl mx-auto">
                        {sec.title}
                      </h2>
                      {sec.subtitle && (
                        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                          {sec.subtitle}
                        </p>
                      )}
                      {sec.props.ctaText && (
                        <div className="pt-2">
                          <Button variant="primary" size="md" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 shadow-lg">
                            {sec.props.ctaText} →
                          </Button>
                        </div>
                      )}
                      {sec.props.imageUrl && (
                        <div className="pt-4 max-w-xl mx-auto">
                          <img
                            src={sec.props.imageUrl}
                            alt="Hero"
                            className="rounded-2xl shadow-xl w-full h-48 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      <Modal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        title="Add Page Block Section"
        description="Choose a pre-styled block component to add to your custom landing page."
        size="md"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[
            { type: 'hero' as const, label: 'Hero Banner', icon: Sparkles, desc: 'High-converting headline with CTAs' },
            { type: 'features' as const, label: 'Features Bento', icon: Layout, desc: '3-column value propositions' },
            { type: 'curriculum' as const, label: 'Learning Tracks', icon: BookOpen, desc: 'Showcase courses & diplomas' },
            { type: 'pricing' as const, label: 'Pricing Plans', icon: CreditCard, desc: 'Live synced tuition cards' },
            { type: 'form' as const, label: 'Custom Form', icon: FileText, desc: 'Embedded admissions inquiry' },
            { type: 'faq' as const, label: 'FAQ Accordion', icon: HelpCircle, desc: 'Common questions & answers' },
          ].map((item) => (
            <button
              key={item.type}
              onClick={() => handleAddSection(item.type)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all cursor-pointer group"
            >
              <item.icon className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-extrabold text-xs text-slate-900">{item.label}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};
