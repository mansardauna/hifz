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
} from 'lucide-react';
import { Button, Input, Card, Badge } from '../ui';

export interface PageSectionBlock {
  id: string;
  type: 'hero' | 'features' | 'curriculum' | 'instructors' | 'pricing' | 'testimonials' | 'faq' | 'cta';
  title: string;
  subtitle?: string;
  enabled: boolean;
  props: Record<string, any>;
}

const TEMPLATE_PRESETS: Record<string, { name: string; icon: string; sections: PageSectionBlock[] }> = {
  quran: {
    name: 'Quran & Islamic Madrasah Template',
    icon: '📖',
    sections: [
      {
        id: 'sec-hero-1',
        type: 'hero',
        title: 'Master Quranic Recitation & Tajweed with Certified Scholars',
        subtitle: 'Live 1-on-1 and group halaqat with verified Sanad chains connected to the Prophet ﷺ.',
        enabled: true,
        props: {
          badgeText: 'Verified Ijazah Programs',
          ctaText: 'Enroll in Free Trial',
          ctaLink: '#enroll',
          bgGradient: 'from-emerald-950 via-teal-900 to-slate-950',
          imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80',
        },
      },
      {
        id: 'sec-feat-1',
        type: 'features',
        title: 'Why Study at Our Academy',
        subtitle: 'Comprehensive pedagogical methodology combining classical authenticity and modern educational technology.',
        enabled: true,
        props: {
          items: [
            { icon: 'Award', title: 'Authentic Sanad Chains', desc: 'Direct unbroken recitation chains in Hafs, Warsh, and Qaloon.' },
            { icon: 'Video', title: 'Live Interactive WebRTC', desc: 'Crystal-clear audio-first virtual classrooms with looper playback.' },
            { icon: 'Clock', title: 'Flexible Global Schedules', desc: 'Morning and evening cohorts tailored to your local timezone.' },
          ],
        },
      },
      {
        id: 'sec-curriculum-1',
        type: 'curriculum',
        title: 'Structured Learning Tracks',
        subtitle: 'From foundational Arabic phonetics to complete 30-Juz memorization.',
        enabled: true,
        props: {
          tracks: ['Noorani Qaidah & Makharij', 'Juz Amma & Ahkam Tajweed', 'Multi-Juz Intensive Hifz', 'Sanad & Ten Qira\'at Mastery'],
        },
      },
    ],
  },
  coding: {
    name: 'Coding & Tech Bootcamp Template',
    icon: '💻',
    sections: [
      {
        id: 'sec-hero-code',
        type: 'hero',
        title: 'Learn Full-Stack Development with Interactive Code Challenges',
        subtitle: 'Build real-world web applications and master algorithms in a live browser IDE sandbox.',
        enabled: true,
        props: {
          badgeText: 'Next-Gen Developer Training',
          ctaText: 'Start Coding Free',
          ctaLink: '#enroll',
          bgGradient: 'from-slate-950 via-blue-950 to-indigo-950',
          imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        },
      },
      {
        id: 'sec-feat-code',
        type: 'features',
        title: 'Hands-On Coding Pedagogy',
        subtitle: 'Zero setup required — write and test production code directly in your browser.',
        enabled: true,
        props: {
          items: [
            { icon: 'Code', title: 'Interactive Test Suites', desc: 'FreeCodeCamp-style unit assertions with instant pass/fail validation.' },
            { icon: 'Layers', title: 'Modern Tech Stack', desc: 'React, TypeScript, Next.js, Node, Python, and SQL databases.' },
            { icon: 'Users', title: 'Live Pair Programming', desc: 'Collaborate in real-time rooms with expert senior mentors.' },
          ],
        },
      },
    ],
  },
  vocational: {
    name: 'Vocational & Trade Workshop Template',
    icon: '🛠️',
    sections: [
      {
        id: 'sec-hero-voc',
        type: 'hero',
        title: 'Master Practical Craftsmanship & Vocational Trades',
        subtitle: 'Hands-on practical training with step-by-step workshop checklists, certified instructors, and portfolio reviews.',
        enabled: true,
        props: {
          badgeText: 'Accredited Vocational Diplomas',
          ctaText: 'Apply for Next Cohort',
          ctaLink: '#enroll',
          bgGradient: 'from-slate-950 via-slate-900 to-amber-950',
          imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
        },
      },
      {
        id: 'sec-feat-voc',
        type: 'features',
        title: 'Practical Vocational Excellence',
        subtitle: 'Learn industry-standard skills with project-based proof submissions and rubric grading.',
        enabled: true,
        props: {
          items: [
            { icon: 'Hammer', title: 'Workshop Action Checklists', desc: 'Step-by-step practical guides with photo and video proof uploads.' },
            { icon: 'Award', title: 'Master Craft Review', desc: 'Personalized voice and rubric feedback from master tradesmen.' },
            { icon: 'Check', title: 'Certified Diplomas', desc: 'Shareable verified certificates upon passing practical assessments.' },
          ],
        },
      },
    ],
  },
};

export const ModularSectionPageBuilder: React.FC = () => {
  const { tenant, updateTenantConfig, language, direction } = useTenant();
  const { success, info } = useToast();

  const [activeTemplateKey, setActiveTemplateKey] = useState<string>('quran');
  const [sections, setSections] = useState<PageSectionBlock[]>(
    tenant.builderLayout?.sections || TEMPLATE_PRESETS['quran'].sections
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState<boolean>(false);

  const activeSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  const handleApplyTemplate = (key: string) => {
    const preset = TEMPLATE_PRESETS[key];
    if (preset) {
      setActiveTemplateKey(key);
      setSections(JSON.parse(JSON.stringify(preset.sections)));
      setSelectedSectionId(preset.sections[0]?.id || '');
      info('Template Loaded', `Applied "${preset.name}" layout preset.`);
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

  const handleSaveLayout = () => {
    updateTenantConfig({
      builderLayout: {
        sections,
        lastUpdated: new Date().toISOString(),
      },
    });
    success('Landing Page Saved! 🚀', 'Your modular website layout has been published live.');
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
            {isLivePreviewOpen ? 'Edit Sections' : 'Live Preview'}
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
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          One-Click Industry Templates
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(TEMPLATE_PRESETS).map(([key, tpl]) => (
            <button
              key={key}
              onClick={() => handleApplyTemplate(key)}
              className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-3 transition-all cursor-pointer text-left ${
                activeTemplateKey === key
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-xl">{tpl.icon}</span>
              <div>
                <div className="font-extrabold">{tpl.name}</div>
                <span className="text-[10px] text-slate-500 font-normal">{tpl.sections.length} pre-styled sections</span>
              </div>
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
                <span>Page Sections & Blocks ({sections.length})</span>
              </span>
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
                        <div className="truncate font-extrabold capitalize">{section.type} Block</div>
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

                {activeSection.props.badgeText !== undefined && (
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
                )}

                {activeSection.props.ctaText !== undefined && (
                  <div className="grid grid-cols-2 gap-3">
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
                    <div key={sec.id} className="p-8 sm:p-12 text-center space-y-4">
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
    </div>
  );
};
