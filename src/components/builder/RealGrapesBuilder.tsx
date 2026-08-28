import React, { useEffect, useRef, useState } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { FormConfig } from '../../types';
import {
  Save,
  Smartphone,
  Tablet,
  Monitor,
  Trash2,
  RotateCcw,
  RotateCw,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  LayoutTemplate,
  X,
  Check,
  FileCheck
} from 'lucide-react';

interface RealGrapesBuilderProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const RealGrapesBuilder: React.FC<RealGrapesBuilderProps> = ({ onAddToast }) => {
  const { tenant, updateTenantConfig } = useTenant();
  const editorRef = useRef<Editor | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const blocksContainerRef = useRef<HTMLDivElement | null>(null);

  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isTemplateBankOpen, setIsTemplateBankOpen] = useState<boolean>(false);

  // Available forms created in Form Builder
  const tenantForms: FormConfig[] = tenant.forms && tenant.forms.length > 0
    ? tenant.forms
    : [
        {
          id: 'form-admissions',
          title: tenant.formTitle || 'Direct Admissions & Evaluation Inquiry',
          description: tenant.formDescription || 'Fill out your prospective student details below for immediate review by our admissions committee.',
          isDefault: true,
          status: 'active',
          fields: tenant.customFormFields || [],
        },
      ];

  // Helper to compile a FormConfig into clean HTML for GrapesJS block
  const compileFormToHtml = (form: FormConfig): string => {
    const fieldsHtml = form.fields
      .map((field) => {
        const widthClass =
          field.width === 'third'
            ? 'w-full md:w-1/3'
            : field.width === 'half'
            ? 'w-full md:w-1/2'
            : 'w-full';

        let inputElement = '';
        if (field.type === 'select') {
          const optionsHtml = (field.options || ['Option 1', 'Option 2'])
            .map((opt) => `<option value="${opt}">${opt}</option>`)
            .join('');
          inputElement = `
            <select name="${field.id}" ${field.required ? 'required' : ''} class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:ring-1 focus:ring-emerald-600">
              <option value="">Select an option...</option>
              ${optionsHtml}
            </select>
          `;
        } else if (field.type === 'textarea') {
          inputElement = `
            <textarea name="${field.id}" ${field.required ? 'required' : ''} rows="3" placeholder="${field.placeholder || ''}" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:ring-1 focus:ring-emerald-600"></textarea>
          `;
        } else {
          inputElement = `
            <input type="${field.type}" name="${field.id}" ${field.required ? 'required' : ''} placeholder="${field.placeholder || ''}" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:ring-1 focus:ring-emerald-600" />
          `;
        }

        return `
          <div class="${widthClass} px-2 mb-3.5">
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              ${field.label} ${field.required ? '<span class="text-rose-500">*</span>' : ''}
            </label>
            ${inputElement}
          </div>
        `;
      })
      .join('');

    return `
      <section id="admissions" class="py-16 px-4 sm:px-8 bg-slate-50 font-sans border-t border-slate-200" data-form-id="${form.id}">
        <div class="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-md border border-slate-200 shadow-md">
          <div class="text-center mb-8">
            <span class="text-emerald-700 font-extrabold text-xs uppercase tracking-widest block mb-1 font-sans">
              ONLINE ADMISSIONS
            </span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
              ${form.title}
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              ${form.description}
            </p>
          </div>

          <form data-hifz-lead-form="true" class="space-y-4">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/2 px-2 mb-3.5">
                <label class="block text-xs font-semibold text-slate-700 mb-1">Student Full Name <span class="text-rose-500">*</span></label>
                <input type="text" name="name" required placeholder="e.g. Zayd Al-Mansoor" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:ring-1 focus:ring-emerald-600" />
              </div>

              <div class="w-full md:w-1/2 px-2 mb-3.5">
                <label class="block text-xs font-semibold text-slate-700 mb-1">Student / Parent Email <span class="text-rose-500">*</span></label>
                <input type="email" name="email" required placeholder="student@example.com" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:ring-1 focus:ring-emerald-600" />
              </div>

              <div class="w-full md:w-1/2 px-2 mb-3.5">
                <label class="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Phone Number</label>
                <input type="tel" name="phone" placeholder="+966 50 123 4567" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:ring-1 focus:ring-emerald-600" />
              </div>

              <div class="w-full md:w-1/2 px-2 mb-3.5">
                <label class="block text-xs font-semibold text-slate-700 mb-1">Interested Program</label>
                <select name="courseInterest" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:ring-1 focus:ring-emerald-600">
                  <option value="Intensive Hifz Program">Intensive Hifz Program</option>
                  <option value="Foundational Tajweed Track">Foundational Tajweed Track</option>
                  <option value="Qira'at & Ijazah Specialization">Qira'at & Ijazah Specialization</option>
                </select>
              </div>

              ${fieldsHtml}
            </div>

            <div class="pt-4 border-t border-slate-100">
              <button type="submit" class="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-md shadow-sm transition-colors cursor-pointer uppercase tracking-wider">
                Submit Admissions Application
              </button>
            </div>
          </form>
        </div>
      </section>
    `;
  };

  // Curated Template Bank
  const TEMPLATE_BANK = [
    {
      id: 'islamic-center-classic',
      name: 'Mosque & Islamic Center Classic',
      description: 'Traditional Islamic Center portal: Green topbar countdown, architectural calligraphy hero, prayer times strip, vision/mission, 6-services grid, and green stats strip.',
      badge: 'Classic Mosque',
      previewImg: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80',
      html: `
        <!-- Top Green Bar -->
        <div class="bg-emerald-700 text-white py-2 px-6 flex justify-between items-center text-xs font-semibold font-sans">
          <div class="flex items-center gap-4">
            <span class="bg-emerald-800 px-2 py-0.5 rounded-md">NEXT BIG EVENT</span>
            <span class="font-mono">02 DAYS : 19 HOURS : 26 MINS : 52 SECS</span>
          </div>
          <div class="hidden sm:flex items-center gap-4 text-emerald-100">
            <span>Call: +1 800 123 4567</span>
            <span>•</span>
            <span>admissions@${tenant.subdomain}.hifz.app</span>
          </div>
        </div>

        <!-- Atmospheric Hero Section -->
        <section class="relative py-28 px-8 bg-slate-950 text-white text-center font-sans overflow-hidden">
          <div class="absolute inset-0 bg-cover bg-center opacity-30" style="background-image: url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1600&q=80');"></div>
          <div class="relative max-w-4xl mx-auto space-y-6">
            <p class="text-3xl sm:text-4xl text-amber-400 font-bold" style="font-family: 'Amiri', serif;">لا إِلَهَ إِلا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ</p>
            <h1 class="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase leading-tight">
              <span class="text-emerald-400">ALLAH</span> HELP THOSE <br />WHO HELP <span class="text-amber-400">THEMSELVES</span>
            </h1>
            <p class="text-lg text-slate-300 max-w-2xl mx-auto">${tenant.tagline}</p>
            <div class="flex justify-center gap-4 pt-4">
              <a href="#courses" class="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-md shadow-md transition-all">Explore Programs</a>
              <a href="#admissions" class="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-md shadow-md transition-all">Apply Now</a>
            </div>
          </div>
        </section>

        <!-- In The Name Of Allah / Vision & Mission -->
        <section class="py-20 px-8 bg-white font-sans">
          <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80" alt="Madrasah Study" class="rounded-md shadow-md border border-slate-200" />
            </div>
            <div class="space-y-6">
              <div>
                <p class="text-2xl font-bold text-slate-900" style="font-family: 'Amiri', serif;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                <h2 class="text-3xl font-bold text-slate-900 mt-2 font-display">In The Name Of Allah The Beneficent The Merciful</h2>
                <div class="w-12 h-1 bg-emerald-600 mt-2 rounded-md"></div>
              </div>
              <p class="text-sm text-slate-600 leading-relaxed">${tenant.tagline}</p>
            </div>
          </div>
        </section>
      `,
    },
    {
      id: 'intensive-hifz-institute',
      name: 'Intensive Hifz & Tajweed Institute',
      description: 'Modern Quran institute design emphasizing daily recitation looper, Medina Mushaf reader, and certified Sanad faculty.',
      badge: 'Hifz Focus',
      previewImg: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80',
      html: `
        <section class="py-24 px-8 bg-emerald-950 text-white text-center font-sans">
          <div class="max-w-4xl mx-auto space-y-6">
            <h1 class="text-4xl sm:text-6xl font-extrabold text-white font-display">
              Preserving Sacred Quranic Knowledge
            </h1>
            <p class="text-lg text-emerald-200 max-w-2xl mx-auto">
              ${tenant.tagline}
            </p>
            <div class="flex justify-center gap-4 pt-4">
              <a href="#admissions" class="px-8 py-3.5 bg-amber-500 text-slate-950 font-bold text-sm rounded-md shadow-md">Enroll Student</a>
            </div>
          </div>
        </section>
      `,
    },
  ];

  // Initial tenant HTML
  const getInitialTenantHtml = (): string => {
    if (tenant.customHtml && tenant.customHtml.trim().length > 50) {
      return tenant.customHtml;
    }
    const defaultForm = tenantForms.find((f) => f.isDefault) || tenantForms[0];
    return `${TEMPLATE_BANK[0].html}\n${compileFormToHtml(defaultForm)}`;
  };

  useEffect(() => {
    if (!containerRef.current || !blocksContainerRef.current) return;

    // Dynamically compile block definitions for all forms
    const formBlocks = tenantForms.map((form) => ({
      id: `form-block-${form.id}`,
      label: `📝 ${form.title}`,
      category: 'Forms & Inquiries',
      content: compileFormToHtml(form),
    }));

    // Standard structural blocks
    const defaultBlocks = [
      {
        id: 'top-countdown-bar',
        label: '⏱️ Top Countdown Bar',
        category: 'Mosque Layout',
        content: `
          <div class="bg-emerald-700 text-white py-2 px-6 flex justify-between items-center text-xs font-semibold font-sans">
            <div class="flex items-center gap-3">
              <span class="bg-emerald-800 px-2 py-0.5 rounded-md">NEXT EVENT</span>
              <span class="font-mono">02 DAYS : 19 HOURS : 26 MINS</span>
            </div>
            <div>Call: +1 800 123 4567</div>
          </div>
        `,
      },
      {
        id: 'hero-calligraphy',
        label: '🕌 Hero with Calligraphy',
        category: 'Mosque Layout',
        content: `
          <section class="py-24 px-8 bg-slate-950 text-white text-center font-sans">
            <p class="text-3xl text-amber-400 font-bold" style="font-family: 'Amiri', serif;">لا إِلَهَ إِلا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ</p>
            <h1 class="text-4xl sm:text-6xl font-extrabold text-white uppercase mt-4">
              <span class="text-emerald-400">ALLAH</span> HELP THOSE <br />WHO HELP <span class="text-amber-400">THEMSELVES</span>
            </h1>
            <p class="text-slate-300 text-sm mt-3 max-w-xl mx-auto">${tenant.tagline}</p>
          </section>
        `,
      },
      {
        id: 'tuition-pricing-cards',
        label: '💳 Tuition Pricing Cards',
        category: 'Courses & Tuition',
        content: `
          <section id="pricing" class="py-16 px-8 bg-slate-50 font-sans">
            <div class="max-w-6xl mx-auto text-center mb-10">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 font-display">Tuition & Subscription Plans</h2>
              <p class="text-xs text-slate-500 mt-1">Direct tuition payments processed by ${tenant.name}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white p-6 rounded-md border border-slate-200 shadow-md">
                <h3 class="font-bold text-base text-slate-900">Foundational Track</h3>
                <p class="text-2xl font-bold text-emerald-700 mt-2 font-mono">$65 <span class="text-xs text-slate-500 font-sans">/ mo</span></p>
                <a href="#admissions" class="mt-4 block w-full py-2 bg-emerald-700 text-white font-bold text-xs text-center rounded-md">Enroll Now</a>
              </div>
              <div class="bg-white p-6 rounded-md border-2 border-emerald-600 shadow-xl">
                <h3 class="font-bold text-base text-slate-900">Intensive Hifz</h3>
                <p class="text-2xl font-bold text-emerald-700 mt-2 font-mono">$140 <span class="text-xs text-slate-500 font-sans">/ mo</span></p>
                <a href="#admissions" class="mt-4 block w-full py-2 bg-emerald-700 text-white font-bold text-xs text-center rounded-md">Enroll Now</a>
              </div>
              <div class="bg-white p-6 rounded-md border border-slate-200 shadow-md">
                <h3 class="font-bold text-base text-slate-900">Sanad & Ijazah</h3>
                <p class="text-2xl font-bold text-emerald-700 mt-2 font-mono">$240 <span class="text-xs text-slate-500 font-sans">/ mo</span></p>
                <a href="#admissions" class="mt-4 block w-full py-2 bg-slate-900 text-white font-bold text-xs text-center rounded-md">Enroll Now</a>
              </div>
            </div>
          </section>
        `,
      },
    ];

    // Initialize GrapesJS Editor
    const editor = grapesjs.init({
      container: containerRef.current,
      fromElement: false,
      height: '100%',
      width: '100%',
      storageManager: false,
      canvas: {
        styles: [
          'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
          'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Amiri:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap',
        ],
        scripts: [],
      },
      panels: { defaults: [] },
      blockManager: {
        appendTo: blocksContainerRef.current,
        blocks: [...formBlocks, ...defaultBlocks],
      },
    });

    // Populate initial content
    editor.setComponents(getInitialTenantHtml());
    
    // Inject default base styling if custom CSS is not set
    const defaultCanvasCss = `
      body { font-family: 'DM Sans', 'Poppins', sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 0; }
      h1, h2, h3, h4 { font-family: 'Poppins', sans-serif; }
      .arabic-heading { font-family: 'Amiri', serif; }
      button, .btn { cursor: pointer; transition: all 0.2s ease-in-out; }
    `;
    editor.setStyle(tenant.customCss || defaultCanvasCss);

    editor.on('update', () => {
      setHasUnsavedChanges(true);
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleDeviceChange = (device: 'desktop' | 'tablet' | 'mobile') => {
    setSelectedDevice(device);
    if (!editorRef.current) return;
    const deviceManager = editorRef.current.Devices;
    if (device === 'mobile') deviceManager.select('mobile');
    else if (device === 'tablet') deviceManager.select('tablet');
    else deviceManager.select('desktop');
  };

  const handleSaveAndPublish = () => {
    if (!editorRef.current) return;

    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();

    updateTenantConfig({
      customHtml: html,
      customCss: css,
    });

    setHasUnsavedChanges(false);

    onAddToast({
      type: 'success',
      title: 'Published to Live Site!',
      message: `Your custom GrapesJS layout is now active on /${tenant.subdomain}`,
    });
  };

  const handleApplyTemplate = (templateHtml: string, templateName: string) => {
    if (!editorRef.current) return;
    editorRef.current.setComponents(templateHtml);
    setHasUnsavedChanges(true);
    setIsTemplateBankOpen(false);

    onAddToast({
      type: 'success',
      title: `Loaded ${templateName}`,
      message: 'Template loaded into editor canvas. Click "Publish to Live Site" to go live.',
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-md flex flex-col h-[850px] font-sans">
      {/* Top Toolbar */}
      <div className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        {/* Left: Branding & Device Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-emerald-400 font-display">GrapesJS Canvas</span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">({tenant.subdomain}.hifz.app)</span>
          </div>

          <div className="bg-slate-800 p-1 rounded-md flex items-center gap-1 border border-slate-700">
            <button
              onClick={() => handleDeviceChange('desktop')}
              className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                selectedDevice === 'desktop' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDeviceChange('tablet')}
              className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                selectedDevice === 'tablet' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDeviceChange('mobile')}
              className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                selectedDevice === 'mobile' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Template Bank Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTemplateBankOpen(true)}
            className="px-3.5 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white font-bold font-display text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-500"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Template Bank</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {hasUnsavedChanges && (
            <span className="text-[11px] text-amber-400 font-semibold animate-pulse hidden sm:inline">
              ● Unsaved Changes
            </span>
          )}

          <button
            onClick={handleSaveAndPublish}
            className="px-4 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-display text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish to Live Site</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Block Sidebar + Iframe Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Blocks Sidebar */}
        <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col overflow-y-auto p-4 shrink-0">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display">Blocks & Components</p>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              {tenantForms.length} Forms Available
            </span>
          </div>

          <div ref={blocksContainerRef} className="space-y-2 flex-1" />
        </div>

        {/* Visual Canvas Container */}
        <div className="flex-1 bg-slate-200 flex items-center justify-center p-3 overflow-auto">
          <div
            ref={containerRef}
            className={`h-full bg-white shadow-xl transition-all duration-200 rounded-md overflow-hidden min-h-[680px] ${
              selectedDevice === 'mobile'
                ? 'w-[375px]'
                : selectedDevice === 'tablet'
                ? 'w-[768px]'
                : 'w-full'
            }`}
          />
        </div>
      </div>

      {/* Template Bank Modal */}
      {isTemplateBankOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="bg-white rounded-md border border-slate-200 shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold font-display text-white">Curated Academy Template Bank</h3>
                  <p className="text-xs text-emerald-300">1-Click load responsive Quran and Islamic Center layouts</p>
                </div>
              </div>
              <button
                onClick={() => setIsTemplateBankOpen(false)}
                className="p-1 rounded-md text-emerald-400 hover:text-white hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Cards */}
            <div className="p-6 overflow-y-auto space-y-4">
              {TEMPLATE_BANK.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="border border-slate-200 rounded-md p-4 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={tmpl.previewImg}
                      alt={tmpl.name}
                      className="w-20 h-14 object-cover rounded-md border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 font-display">{tmpl.name}</h4>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                          {tmpl.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{tmpl.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplyTemplate(tmpl.html, tmpl.name)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-display rounded-md shadow-xs shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Load Template</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-end">
              <button
                onClick={() => setIsTemplateBankOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-md cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
