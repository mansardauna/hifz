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
  Search,
  Layers,
  Code2,
  Eye,
  Sliders,
  HelpCircle,
  Plus,
  Download,
  Copy,
  ExternalLink,
  BookOpen,
  Award,
  Wand2
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
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportedHtml, setExportedHtml] = useState<string>('');
  const [exportedCss, setExportedCss] = useState<string>('');

  // AI Page Builder State
  const [isAiPageModalOpen, setIsAiPageModalOpen] = useState<boolean>(false);
  const [aiFocus, setAiFocus] = useState<string>('');
  const [aiAudience, setAiAudience] = useState<string>('All Ages & Beginners');
  const [aiHighlight, setAiHighlight] = useState<string>('1-on-1 Daily Live Recitation & Sanad Certification');
  const [isGeneratingWithAi, setIsGeneratingWithAi] = useState<boolean>(false);

  const handleGeneratePageWithAi = () => {
    setIsGeneratingWithAi(true);
    setTimeout(() => {
      const isCoding = (aiFocus && (aiFocus.toLowerCase().includes('code') || aiFocus.toLowerCase().includes('software'))) || tenant.niche === 'coding';
      const academyTitle = tenant.name || (isCoding ? 'Code Academy Global' : 'Al-Furqan Quran Academy');
      const headline = aiFocus || (isCoding ? 'Master Modern Software Engineering & Cloud Architecture' : 'Master Authentic Quran Memorization & Verified Sanad Recitation');
      const description = `Join our elite academy designed for ${aiAudience.toLowerCase()}. Featuring ${aiHighlight.toLowerCase()} with live real-time interactive halaqahs.`;

      const generatedHtml = `
        <header class="bg-white border-b border-slate-200 py-4 px-6 sm:px-12 flex items-center justify-between font-sans">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              ${academyTitle.slice(0, 2).toUpperCase()}
            </div>
            <span class="font-extrabold text-slate-900 text-base">${academyTitle}</span>
          </div>
          <nav class="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#about" class="hover:text-slate-900">About</a>
            <a href="#curriculum" class="hover:text-slate-900">Curriculum</a>
            <a href="#faculty" class="hover:text-slate-900">Faculty</a>
            <a href="#pricing" class="hover:text-slate-900">Tuition</a>
            <a href="#admissions" class="hover:text-slate-900">Admissions</a>
          </nav>
          <a href="#admissions" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all">
            Apply Now &rarr;
          </a>
        </header>

        <section class="py-20 lg:py-28 px-6 sm:px-12 bg-white font-sans text-center border-b border-slate-200">
          <div class="max-w-4xl mx-auto space-y-6">
            <span class="inline-block px-3.5 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wider">
              ✨ AI-Generated Architecture
            </span>
            <h1 class="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight">
              ${headline}
            </h1>
            <p class="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              ${description}
            </p>
            <div class="pt-4 flex flex-wrap items-center justify-center gap-3">
              <a href="#admissions" class="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all">
                Enroll Today
              </a>
              <a href="#curriculum" class="px-7 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl border border-slate-200 transition-all">
                Explore Curriculum
              </a>
            </div>
          </div>
        </section>

        <section class="py-12 px-6 sm:px-12 bg-slate-50 border-b border-slate-200 font-sans">
          <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div class="text-3xl font-black text-slate-900 font-mono">1,400+</div>
              <div class="text-xs text-slate-500 font-medium mt-1">Graduated Students</div>
            </div>
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div class="text-3xl font-black text-slate-900 font-mono">100%</div>
              <div class="text-xs text-slate-500 font-medium mt-1">Live SFU Halaqahs</div>
            </div>
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div class="text-3xl font-black text-slate-900 font-mono">1-on-1</div>
              <div class="text-xs text-slate-500 font-medium mt-1">Certified Mentors</div>
            </div>
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div class="text-3xl font-black text-slate-900 font-mono">4.9/5</div>
              <div class="text-xs text-slate-500 font-medium mt-1">Parent & Student Rating</div>
            </div>
          </div>
        </section>

        <section id="curriculum" class="py-20 px-6 sm:px-12 bg-white font-sans border-b border-slate-200">
          <div class="max-w-4xl mx-auto space-y-8">
            <div class="text-center">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wider">Course Syllabus</span>
              <h2 class="text-3xl font-extrabold text-slate-900 mt-2">Structured Learning Roadmap</h2>
              <p class="text-xs sm:text-sm text-slate-500 mt-1">Built for ${aiAudience.toLowerCase()} with progressive evaluation milestones.</p>
            </div>
            <div class="space-y-3">
              <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div class="flex items-center justify-between">
                  <h3 class="font-extrabold text-sm text-slate-900">Module 1: Foundations & Diagnostic Assessment</h3>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Weeks 1 - 4</span>
                </div>
                <p class="text-xs text-slate-600 mt-1.5">Core principles, oral recitation rules, and baseline proficiency benchmarks.</p>
              </div>
              <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div class="flex items-center justify-between">
                  <h3 class="font-extrabold text-sm text-slate-900">Module 2: Intensive Mastery & Practicum</h3>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Weeks 5 - 10</span>
                </div>
                <p class="text-xs text-slate-600 mt-1.5">Interactive live video halaqahs, daily revision logs, and personalized feedback.</p>
              </div>
              <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div class="flex items-center justify-between">
                  <h3 class="font-extrabold text-sm text-slate-900">Module 3: Khatmah Examination & Sanad Ijazah</h3>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">Weeks 11 - 16</span>
                </div>
                <p class="text-xs text-slate-600 mt-1.5">Oral examination, formal certification, and graduation credential verification.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="admissions" class="py-20 px-6 sm:px-12 bg-slate-50 font-sans border-b border-slate-200">
          <div class="max-w-2xl mx-auto text-center mb-8">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wider">Admissions Open</span>
            <h2 class="text-3xl font-extrabold text-slate-900 mt-2">Apply for Immediate Enrollment</h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">Submit your details below and our admissions team will schedule your evaluation.</p>
          </div>
          <div class="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
            <form data-hifz-lead-form="true" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1">Student / Applicant Full Name</label>
                <input type="text" name="name" required placeholder="e.g. Zaid Al-Mansoor" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
                <input type="email" name="email" required placeholder="name@example.com" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1">Phone / WhatsApp Number</label>
                <input type="tel" name="phone" required placeholder="+1 (555) 000-0000" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <button type="submit" class="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer">
                Submit Admissions Application &rarr;
              </button>
            </form>
          </div>
        </section>

        <footer class="py-12 px-6 sm:px-12 bg-slate-900 text-white font-sans text-center">
          <div class="max-w-6xl mx-auto space-y-4">
            <div class="font-bold text-base text-white">${academyTitle}</div>
            <p class="text-xs text-slate-400">© 2026 ${academyTitle}. Powered by TechMadrasah OS.</p>
          </div>
        </footer>
      `;

      if (editorRef.current) {
        editorRef.current.setComponents(generatedHtml);
      }

      const pageSchemaJson = {
        type: 'ai_generated_page',
        version: '2.0',
        generatedAt: new Date().toISOString(),
        prompt: aiFocus,
        audience: aiAudience,
        highlight: aiHighlight,
        sections: ['header', 'hero', 'stats', 'curriculum', 'admissions_form', 'footer']
      };

      updateTenantConfig({
        customHtml: generatedHtml,
        landingPageSchema: pageSchemaJson,
        tagline: headline,
        aboutText: description,
      });

      setIsGeneratingWithAi(false);
      setIsAiPageModalOpen(false);
      setHasUnsavedChanges(true);

      onAddToast({
        type: 'success',
        title: 'AI Landing Page Generated!',
        message: 'Your custom academy landing page has been compiled as JSON and injected into the canvas.',
      });
    }, 800);
  };

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

  // Helper to compile a FormConfig into clean accessible HTML for GrapesJS block
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
            <select id="${field.id}" name="${field.id}" ${field.required ? 'required aria-required="true"' : ''} class="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600">
              <option value="">Select an option...</option>
              ${optionsHtml}
            </select>
          `;
        } else if (field.type === 'textarea') {
          inputElement = `
            <textarea id="${field.id}" name="${field.id}" ${field.required ? 'required aria-required="true"' : ''} rows="3" placeholder="${field.placeholder || ''}" class="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"></textarea>
          `;
        } else {
          inputElement = `
            <input id="${field.id}" type="${field.type}" name="${field.id}" ${field.required ? 'required aria-required="true"' : ''} placeholder="${field.placeholder || ''}" class="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600" />
          `;
        }

        return `
          <div class="${widthClass} px-2 mb-4">
            <label for="${field.id}" class="block text-xs font-bold text-slate-700 mb-1">
              ${field.label} ${field.required ? '<span class="text-rose-500" aria-hidden="true">*</span>' : ''}
            </label>
            ${inputElement}
          </div>
        `;
      })
      .join('');

    return `
      <section id="admissions" aria-labelledby="admissions-title" class="py-20 px-4 sm:px-8 bg-slate-50 font-sans border-t border-slate-200" data-form-id="${form.id}">
        <div class="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
          <div class="text-center mb-8">
            <span class="text-blue-600 font-extrabold text-xs uppercase tracking-widest block mb-1">
              ONLINE ADMISSIONS
            </span>
            <h2 id="admissions-title" class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
              ${form.title}
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              ${form.description}
            </p>
          </div>

          <form data-hifz-lead-form="true" class="space-y-4" noValidate>
            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/2 px-2 mb-4">
                <label for="name" class="block text-xs font-bold text-slate-700 mb-1">Full Name <span class="text-rose-500" aria-hidden="true">*</span></label>
                <input id="name" type="text" name="name" required aria-required="true" placeholder="e.g. Alex Mercer" class="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600" />
              </div>

              <div class="w-full md:w-1/2 px-2 mb-4">
                <label for="email" class="block text-xs font-bold text-slate-700 mb-1">Email Address <span class="text-rose-500" aria-hidden="true">*</span></label>
                <input id="email" type="email" name="email" required aria-required="true" placeholder="student@example.com" class="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600" />
              </div>

              <div class="w-full md:w-1/2 px-2 mb-4">
                <label for="phone" class="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone Number <span class="text-rose-500" aria-hidden="true">*</span></label>
                <input id="phone" type="tel" name="phone" required aria-required="true" placeholder="+1 (555) 000-0000" class="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600" />
              </div>

              <div class="w-full md:w-1/2 px-2 mb-4">
                <label for="courseInterest" class="block text-xs font-bold text-slate-700 mb-1">Interested Track</label>
                <select id="courseInterest" name="courseInterest" class="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600">
                  <option value="Primary Intensive Track">Primary Intensive Track</option>
                  <option value="Advanced Specialization">Advanced Specialization</option>
                  <option value="Foundational Certification">Foundational Certification</option>
                </select>
              </div>

              ${fieldsHtml}
            </div>

            <div class="pt-4 border-t border-slate-100">
              <button type="submit" class="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider">
                Submit Admissions Application
              </button>
            </div>
          </form>
        </div>
      </section>
    `;
  };

  // Pre-Built Landing Page Template Bank
  const TEMPLATE_BANK = [
    {
      id: 'islamic-center-classic',
      name: 'Al-Furqan Quran Academy & Hifz',
      description: 'Sacred Medina calligraphy hero, Tajweed audio tracks, 30 Juz memorization milestones, and online admissions.',
      badge: 'Quran & Hifz',
      previewImg: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80',
      html: `
        <!-- Top Announcement Bar -->
        <header role="banner" class="bg-emerald-700 text-white py-2.5 px-6 flex justify-between items-center text-xs font-semibold font-sans">
          <div class="flex items-center gap-3">
            <span class="bg-emerald-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">New Cohort</span>
            <span class="font-mono">FALL ENROLLMENT NOW OPEN • LIMITED SEATS</span>
          </div>
          <div class="hidden sm:flex items-center gap-4 text-emerald-100">
            <span>Call: +1 (800) 123-4567</span>
            <span>•</span>
            <span>admissions@${tenant.subdomain}.techmadrasah.app</span>
          </div>
        </header>

        <!-- Sacred Calligraphy Hero (Light Theme with Crisp Black Headings) -->
        <section aria-labelledby="hero-title" class="relative py-20 px-8 bg-slate-50 text-slate-900 text-center font-sans border-b border-slate-200">
          <div class="relative max-w-4xl mx-auto space-y-6">
            <p class="text-3xl sm:text-5xl text-emerald-700 font-bold" style="font-family: 'Amiri', serif;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <h1 id="hero-title" class="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Master Quranic Recitation & Tajweed with Verified Sanad
            </h1>
            <p class="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">${tenant.tagline}</p>
            <div class="flex justify-center gap-4 pt-4">
              <a href="#courses" class="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all">Explore Curriculums</a>
              <a href="#admissions" class="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-lg transition-all">Apply for Admissions</a>
            </div>
          </div>
        </section>

        <!-- 3-Column Highlights -->
        <section aria-label="Key Highlights" class="py-16 px-8 bg-white font-sans border-b border-slate-200">
          <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div class="text-3xl">📖</div>
              <h3 class="font-bold text-base text-slate-900">Medina Mushaf Reader</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Interactive digital Mushaf with ayah audio looping and rule highlighting.</p>
            </div>
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div class="text-3xl">🎙️</div>
              <h3 class="font-bold text-base text-slate-900">Oral Homework Looper</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Submit recorded recitations for personalized tajweed audio corrections from certified Qaris.</p>
            </div>
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div class="text-3xl">📜</div>
              <h3 class="font-bold text-base text-slate-900">Verified Sanad Ijazah</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Continuous chains of transmission connecting students directly to scholarly lineage.</p>
            </div>
          </div>
        </section>
      `,
    },
    {
      id: 'modern-codecraft-bootcamp',
      name: 'Modern CodeCraft Developer Bootcamp',
      description: 'Engineered for software academies: Clean high-contrast hero, LeetCode algorithms, live coding sandbox preview, and Git PR tracks.',
      badge: 'Tech & Coding',
      previewImg: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      html: `
        <!-- Tech Hero Section (Light Theme with Crisp Black Text & Code Sandbox) -->
        <section aria-labelledby="tech-hero" class="py-20 px-8 bg-white text-slate-900 font-sans border-b border-slate-200">
          <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div class="lg:col-span-7 space-y-6">
              <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono">
                <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> FULL-STACK ENGINEERING COHORT
              </div>
              <h1 id="tech-hero" class="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Master Modern <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Software Architecture</span>
              </h1>
              <p class="text-base text-slate-600 leading-relaxed max-w-xl">
                Build real-world full-stack web applications, solve algorithm problem sets, and master React 19, TypeScript, and microservices with 1-on-1 lead mentor code reviews.
              </p>
              <div class="flex flex-wrap gap-4 pt-2">
                <a href="#admissions" class="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all">Enroll in Cohort</a>
                <a href="#courses" class="px-8 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm rounded-xl transition-all">View Curriculum</a>
              </div>
            </div>

            <!-- Terminal Mockup -->
            <div class="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-2xl font-mono text-xs text-white">
              <div class="flex items-center gap-1.5 pb-3 border-b border-slate-800">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span class="text-slate-400 ml-2 text-[10px]">main.ts — Live Sandbox</span>
              </div>
              <div class="pt-3 text-emerald-400 space-y-1">
                <p class="text-slate-500">// Interactive V8 Coding Sandbox</p>
                <p><span class="text-blue-400">const</span> academy = <span class="text-amber-300">&quot;${tenant.name}&quot;</span>;</p>
                <p><span class="text-blue-400">async function</span> launchCareer() {</p>
                <p class="pl-4"><span class="text-purple-400">await</span> masterTypeScript();</p>
                <p class="pl-4"><span class="text-purple-400">return</span> <span class="text-amber-300">&quot;Full-Stack Engineer 🚀&quot;</span>;</p>
                <p>}</p>
                <p class="text-blue-400 pt-2">&gt; CI/CD Test Suite: 100% Passed</p>
              </div>
            </div>
          </div>
        </section>
      `,
    },
    {
      id: 'bayyinah-arabic-institute',
      name: 'Classical Language & Humanities Institute',
      description: 'Sapphire & warm ivory design for grammar, linguistics, and classical humanities academies.',
      badge: 'Language & Humanities',
      previewImg: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80',
      html: `
        <section aria-labelledby="arabic-hero" class="py-20 px-8 bg-slate-50 text-slate-900 text-center font-sans border-b border-slate-200">
          <div class="max-w-4xl mx-auto space-y-6">
            <span class="inline-block px-3.5 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Classical Arabic & Linguistics Track
            </span>
            <h1 id="arabic-hero" class="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight">
              Master Classical Arabic Grammar & Rhetoric
            </h1>
            <p class="text-base text-slate-600 max-w-2xl mx-auto">
              ${tenant.tagline}
            </p>
            <div class="flex justify-center gap-4 pt-4">
              <a href="#admissions" class="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all">Apply for Cohort</a>
            </div>
          </div>
        </section>
      `,
    },
    {
      id: 'minimalist-saas-academy',
      name: 'Minimalist Modern SaaS Academy',
      description: 'High-contrast clean white aesthetic with subtle borders, metric badges, and clear conversion paths.',
      badge: 'Minimalist SaaS',
      previewImg: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
      html: `
        <section aria-labelledby="saas-hero" class="py-24 px-8 bg-white text-slate-900 text-center font-sans border-b border-slate-200">
          <div class="max-w-4xl mx-auto space-y-6">
            <span class="inline-block px-3.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800 border border-slate-300">
              Transformative Education Platform
            </span>
            <h1 id="saas-hero" class="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight">
              ${tenant.name}
            </h1>
            <p class="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              ${tenant.tagline}
            </p>
            <div class="flex justify-center gap-4 pt-4">
              <a href="#pricing" class="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-lg transition-all">View Pricing Plans</a>
              <a href="#admissions" class="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm rounded-xl transition-all">Contact Admissions</a>
            </div>
          </div>
        </section>
      `,
    }
  ];

  // Helper for generating big, crisp SVG icons for GrapesJS block labels
  const makeBlockLabel = (title: string, svgPath: string) => {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 10px 4px; text-align: center;">
        <svg style="width: 26px; height: 26px; stroke: #2563eb; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;" viewBox="0 0 24 24">
          ${svgPath}
        </svg>
        <span style="font-size: 11px; font-weight: 700; color: #1e293b; line-height: 1.2;">${title}</span>
      </div>
    `;
  };

  // Initial tenant HTML
  const getInitialTenantHtml = (): string => {
    if (tenant.customHtml && tenant.customHtml.trim().length > 50) {
      return tenant.customHtml;
    }
    const defaultForm = tenantForms.find((f) => f.isDefault) || tenantForms[0];
    const isCoding = tenant.niche === 'coding' || tenant.subdomain.includes('code');
    const selectedTemplate = isCoding ? TEMPLATE_BANK[1] : TEMPLATE_BANK[0];
    return `${selectedTemplate.html}\n${compileFormToHtml(defaultForm)}`;
  };

  useEffect(() => {
    if (!containerRef.current || !blocksContainerRef.current) return;

    // Dynamically compile block definitions for all forms with sharp SVG icon
    const formBlocks = tenantForms.map((form) => ({
      id: `form-block-${form.id}`,
      label: makeBlockLabel(
        form.title,
        `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>`
      ),
      category: 'Admissions & Forms',
      content: compileFormToHtml(form),
    }));

    // Comprehensive Library of Accessible & SEO-Optimized Semantic Blocks with Real SVG Icons (Zero Emojis)
    const defaultBlocks = [
      // 1. Headers & Announcements
      {
        id: 'top-notification-banner',
        label: makeBlockLabel(
          'Announcement Bar',
          `<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>`
        ),
        category: 'Headers & Nav',
        content: `
          <div class="bg-blue-600 text-white py-2.5 px-6 flex justify-between items-center text-xs font-semibold font-sans">
            <div class="flex items-center gap-2">
              <span class="bg-blue-800 px-2 py-0.5 rounded-full text-[10px] font-bold">LIMITED TIME</span>
              <span>Enrollment for the upcoming cohort closes Friday!</span>
            </div>
            <a href="#admissions" class="underline font-bold text-[11px] hover:text-blue-100">Apply Now &rarr;</a>
          </div>
        `,
      },
      {
        id: 'accessible-sticky-nav',
        label: makeBlockLabel(
          'Navigation Bar',
          `<polygon points="3 11 22 2 13 21 11 13 3 11"/>`
        ),
        category: 'Headers & Nav',
        content: `
          <header role="banner" class="bg-white border-b border-slate-200 sticky top-0 z-30 py-3 px-6 font-sans">
            <div class="max-w-7xl mx-auto flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">🎓</span>
                <span class="font-extrabold text-sm sm:text-base text-slate-900">${tenant.name}</span>
              </div>
              <nav aria-label="Primary" class="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
                <a href="#courses" class="hover:text-slate-900">Curriculums</a>
                <a href="#pricing" class="hover:text-slate-900">Tuition</a>
                <a href="#features" class="hover:text-slate-900">Experience</a>
                <a href="#faq" class="hover:text-slate-900">FAQ</a>
              </nav>
              <a href="#admissions" class="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all">
                Enroll Now
              </a>
            </div>
          </header>
        `,
      },

      // 2. Hero Sections
      {
        id: 'split-hero-accessible',
        label: makeBlockLabel(
          'Split Hero',
          `<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>`
        ),
        category: 'Hero Sections',
        content: `
          <section aria-labelledby="hero-title" class="py-20 px-6 sm:px-12 bg-white font-sans border-b border-slate-200">
            <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div class="space-y-6">
                <span class="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-block">
                  Transformative Learning Experience
                </span>
                <h1 id="hero-title" class="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                  Unlock Your Potential with Master Mentorship
                </h1>
                <p class="text-base text-slate-600 leading-relaxed">
                  Join our cohort-based academy with daily interactive sessions, live classrooms, and verified milestone certifications.
                </p>
                <div class="flex flex-wrap gap-4 pt-2">
                  <a href="#admissions" class="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all">Get Started</a>
                  <a href="#courses" class="px-7 py-3.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm rounded-xl transition-all">Explore Tracks</a>
                </div>
              </div>
              <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-video bg-slate-900">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Students in live interactive classroom" class="w-full h-full object-cover" />
              </div>
            </div>
          </section>
        `,
      },

      // 3. Curriculum & Courses
      {
        id: 'curriculum-3col-grid',
        label: makeBlockLabel(
          '3-Col Course Grid',
          `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`
        ),
        category: 'Curriculum & Tracks',
        content: `
          <section id="courses" aria-labelledby="courses-title" class="py-20 px-6 sm:px-12 bg-slate-50 font-sans border-b border-slate-200">
            <div class="max-w-6xl mx-auto text-center mb-12">
              <h2 id="courses-title" class="text-3xl font-extrabold text-slate-900">Featured Academy Programs</h2>
              <p class="text-xs sm:text-sm text-slate-500 mt-2">Engineered for progressive milestone mastery and real-world certification.</p>
            </div>
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <article class="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col justify-between space-y-4">
                <div class="space-y-2">
                  <span class="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">Beginner Track</span>
                  <h3 class="font-extrabold text-base text-slate-900">Foundations Immersion</h3>
                  <p class="text-xs text-slate-600 leading-relaxed">Master the essential core concepts, grammar, and fundamental building blocks.</p>
                </div>
                <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span class="font-bold text-slate-900 font-mono text-sm">$65/mo</span>
                  <a href="#admissions" class="text-blue-600 font-bold text-xs hover:underline">Enroll &rarr;</a>
                </div>
              </article>
              <article class="bg-white p-6 rounded-3xl border-2 border-blue-600 shadow-xl flex flex-col justify-between space-y-4 relative">
                <span class="absolute -top-3 left-6 bg-blue-600 text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">Recommended</span>
                <div class="space-y-2">
                  <span class="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Intermediate</span>
                  <h3 class="font-extrabold text-base text-slate-900">Accelerated Mastery</h3>
                  <p class="text-xs text-slate-600 leading-relaxed">Daily intensive practice, live pair exercises, and 1-on-1 evaluation audits.</p>
                </div>
                <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span class="font-bold text-slate-900 font-mono text-sm">$129/mo</span>
                  <a href="#admissions" class="text-blue-600 font-bold text-xs hover:underline">Enroll &rarr;</a>
                </div>
              </article>
              <article class="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col justify-between space-y-4">
                <div class="space-y-2">
                  <span class="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700">Advanced</span>
                  <h3 class="font-extrabold text-base text-slate-900">Specialization & Sanad</h3>
                  <p class="text-xs text-slate-600 leading-relaxed">Comprehensive capstone projects, advanced parsing, and verified certification.</p>
                </div>
                <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span class="font-bold text-slate-900 font-mono text-sm">$199/mo</span>
                  <a href="#admissions" class="text-blue-600 font-bold text-xs hover:underline">Enroll &rarr;</a>
                </div>
              </article>
            </div>
          </section>
        `,
      },

      // 4. Tuition & Pricing
      {
        id: 'tuition-pricing-table',
        label: makeBlockLabel(
          'Pricing Table',
          `<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>`
        ),
        category: 'Tuition & Pricing',
        content: `
          <section id="pricing" aria-labelledby="pricing-title" class="py-20 px-6 sm:px-12 bg-white font-sans border-b border-slate-200">
            <div class="max-w-6xl mx-auto text-center mb-12">
              <h2 id="pricing-title" class="text-3xl font-extrabold text-slate-900">Transparent Tuition Plans</h2>
              <p class="text-xs sm:text-sm text-slate-500 mt-2">All tuition payments processed securely with zero hidden fees.</p>
            </div>
            <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                <h3 class="font-bold text-base text-slate-900">Standard Tier</h3>
                <div class="text-3xl font-extrabold text-slate-900 font-mono">$65 <span class="text-xs font-normal text-slate-500">/ mo</span></div>
                <p class="text-xs text-slate-600">2 live classes per week with access to course recordings.</p>
                <a href="#admissions" class="block w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center rounded-xl transition-all">Select Plan</a>
              </div>
              <div class="bg-white p-6 rounded-3xl border-2 border-blue-600 shadow-xl space-y-4 relative">
                <span class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">Most Popular</span>
                <h3 class="font-bold text-base text-slate-900">Intensive Tier</h3>
                <div class="text-3xl font-extrabold text-blue-600 font-mono">$129 <span class="text-xs font-normal text-slate-500">/ mo</span></div>
                <p class="text-xs text-slate-600">4 live classes per week, 1-on-1 evaluations, and audio looper feedback.</p>
                <a href="#admissions" class="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center rounded-xl transition-all">Select Plan</a>
              </div>
              <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                <h3 class="font-bold text-base text-slate-900">Ijazah & Mentorship</h3>
                <div class="text-3xl font-extrabold text-slate-900 font-mono">$220 <span class="text-xs font-normal text-slate-500">/ mo</span></div>
                <p class="text-xs text-slate-600">Daily 1-on-1 instruction, unbroken chain Sanad verification, and priority mentoring.</p>
                <a href="#admissions" class="block w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center rounded-xl transition-all">Select Plan</a>
              </div>
            </div>
          </section>
        `,
      },

      // 5. Virtual Classroom Showcase
      // 5. Virtual Classroom Showcase
      {
        id: 'virtual-classroom-teaser',
        label: makeBlockLabel(
          'Live Classroom',
          `<path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2"/>`
        ),
        category: 'Live Classroom',
        content: `
          <section aria-labelledby="classroom-title" class="py-20 px-6 sm:px-12 bg-slate-50 text-slate-900 font-sans border-b border-slate-200">
            <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div class="space-y-6">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block font-mono">
                  ● REAL-TIME WEBRTC SFU ENGINE
                </span>
                <h2 id="classroom-title" class="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                  Experience Low-Latency Live Virtual Classrooms
                </h2>
                <p class="text-sm text-slate-600 leading-relaxed">
                  Engineered with crystal-clear audio codecs, interactive collaborative whiteboards, screen sharing, and automated session recordings.
                </p>
                <ul class="space-y-2 text-xs text-slate-700">
                  <li class="flex items-center gap-2 font-medium">✓ HD Video & High-Fidelity Audio</li>
                  <li class="flex items-center gap-2 font-medium">✓ Real-time Teacher Whiteboard Annotation</li>
                  <li class="flex items-center gap-2 font-medium">✓ Dynamic Workspace & Sandbox Integration</li>
                </ul>
              </div>
              <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" alt="Live virtual session UI preview" class="rounded-2xl w-full object-cover aspect-video" />
              </div>
            </div>
          </section>
        `,
      },

      // 6. Testimonials & Social Proof
      {
        id: 'testimonials-3col',
        label: makeBlockLabel(
          'Reviews Grid',
          `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`
        ),
        category: 'Social Proof',
        content: `
          <section aria-labelledby="reviews-title" class="py-20 px-6 sm:px-12 bg-slate-50 font-sans border-b border-slate-200">
            <div class="max-w-6xl mx-auto text-center mb-12">
              <h2 id="reviews-title" class="text-3xl font-extrabold text-slate-900">Student & Parent Success Stories</h2>
              <p class="text-xs sm:text-sm text-slate-500 mt-2">Hear directly from graduates who transformed their knowledge with us.</p>
            </div>
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div class="text-amber-400 font-bold text-sm">★★★★★</div>
                <p class="text-xs text-slate-600 leading-relaxed">"The live feedback and structured curriculum made memorization effortless. The teacher is exceptionally thorough."</p>
                <div class="pt-2 border-t border-slate-100">
                  <p class="font-bold text-xs text-slate-900">Ibrahim K.</p>
                  <span class="text-[10px] text-slate-400">Graduate • Juz 30 Complete</span>
                </div>
              </div>
              <div class="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div class="text-amber-400 font-bold text-sm">★★★★★</div>
                <p class="text-xs text-slate-600 leading-relaxed">"The coding sandbox and 1-on-1 code reviews helped me land my first software engineering job in 4 months."</p>
                <div class="pt-2 border-t border-slate-100">
                  <p class="font-bold text-xs text-slate-900">Rachel G.</p>
                  <span class="text-[10px] text-slate-400">Full-Stack Bootcamp Graduate</span>
                </div>
              </div>
              <div class="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div class="text-amber-400 font-bold text-sm">★★★★★</div>
                <p class="text-xs text-slate-600 leading-relaxed">"The best online academy I've attended. The audio looper and feedback system makes daily review seamless."</p>
                <div class="pt-2 border-t border-slate-100">
                  <p class="font-bold text-xs text-slate-900">Tariq M.</p>
                  <span class="text-[10px] text-slate-400">Sanad Recitation Student</span>
                </div>
              </div>
            </div>
          </section>
        `,
      },

      // 7. Statistics Counters
      {
        id: 'stats-4col-counter',
        label: makeBlockLabel(
          'Stat Counters',
          `<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>`
        ),
        category: 'Social Proof',
        content: `
          <section aria-label="Academy Statistics" class="py-16 px-6 sm:px-12 bg-slate-50 text-slate-900 font-sans border-b border-slate-200">
            <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div class="space-y-1">
                <div class="text-3xl sm:text-4xl font-extrabold text-blue-600 font-mono">1,200+</div>
                <p class="text-xs font-bold text-slate-700">Active Students</p>
              </div>
              <div class="space-y-1">
                <div class="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">99.4%</div>
                <p class="text-xs font-bold text-slate-700">Graduation Pass Rate</p>
              </div>
              <div class="space-y-1">
                <div class="text-3xl sm:text-4xl font-extrabold text-amber-600 font-mono">15 : 1</div>
                <p class="text-xs font-bold text-slate-700">Student-Mentor Ratio</p>
              </div>
              <div class="space-y-1">
                <div class="text-3xl sm:text-4xl font-extrabold text-purple-600 font-mono">100%</div>
                <p class="text-xs font-bold text-slate-700">Live Virtual Interactive</p>
              </div>
            </div>
          </section>
        `,
      },

      // 8. FAQ Accordion
      {
        id: 'faq-accessible-accordion',
        label: makeBlockLabel(
          'FAQ Accordion',
          `<circle cx="12" cy="12" r="10"/><path d="9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/>`
        ),
        category: 'FAQ & Support',
        content: `
          <section id="faq" aria-labelledby="faq-title" class="py-20 px-6 sm:px-12 bg-white font-sans border-b border-slate-200">
            <div class="max-w-4xl mx-auto space-y-8">
              <div class="text-center">
                <h2 id="faq-title" class="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
                <p class="text-xs sm:text-sm text-slate-500 mt-2">Everything you need to know about enrollment, schedules, and tuition.</p>
              </div>
              <div class="space-y-3">
                <details class="p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <summary class="font-bold text-xs sm:text-sm text-slate-900">What are the class schedules?</summary>
                  <p class="text-xs text-slate-600 mt-2 leading-relaxed">We offer flexible evening and weekend tracks. All live sessions are also recorded and accessible in your student portal.</p>
                </details>
                <details class="p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <summary class="font-bold text-xs sm:text-sm text-slate-900">Can I request a refund if my schedule changes?</summary>
                  <p class="text-xs text-slate-600 mt-2 leading-relaxed">Yes! We provide a 14-day 100% money-back satisfaction guarantee on all enrollment tuition plans.</p>
                </details>
                <details class="p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <summary class="font-bold text-xs sm:text-sm text-slate-900">How do I access the live classroom?</summary>
                  <p class="text-xs text-slate-600 mt-2 leading-relaxed">Upon registration, sign in to your student dashboard and click 'Join Live Class' to join the low-latency SFU classroom.</p>
                </details>
              </div>
            </div>
          </section>
        `,
      },

      // 9. Call to Action (CTA)
      {
        id: 'cta-cohort-urgency',
        label: makeBlockLabel(
          'Deadline Banner',
          `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`
        ),
        category: 'Call to Action',
        content: `
          <section aria-label="Admissions Deadline" class="py-20 px-6 sm:px-12 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white text-center font-sans">
            <div class="max-w-3xl mx-auto space-y-6">
              <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Elevate Your Knowledge?</h2>
              <p class="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">Seats for the upcoming batch are strictly limited to maintain small cohort sizes and 1-on-1 mentorship.</p>
              <div class="pt-2">
                <a href="#admissions" class="inline-block px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm rounded-xl shadow-xl transition-all">
                  Submit Admissions Inquiry Now &rarr;
                </a>
              </div>
            </div>
          </section>
        `,
      },

      // 10. Multi-Column Footer
      {
        id: 'accessible-mega-footer',
        label: makeBlockLabel(
          'Mega Footer',
          `<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>`
        ),
        category: 'Footers & Legal',
        content: `
          <footer role="contentinfo" class="bg-slate-50 text-slate-900 py-16 px-6 sm:px-12 font-sans border-t border-slate-200">
            <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div class="space-y-3">
                <h3 class="font-extrabold text-base text-slate-900">${tenant.name}</h3>
                <p class="text-xs text-slate-600 leading-relaxed">${tenant.tagline}</p>
              </div>
              <div class="space-y-2">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-800">Quick Links</h4>
                <ul class="space-y-1 text-xs text-slate-600">
                  <li><a href="#courses" class="hover:text-slate-900">Curriculums</a></li>
                  <li><a href="#pricing" class="hover:text-slate-900">Tuition Plans</a></li>
                  <li><a href="#admissions" class="hover:text-slate-900">Admissions</a></li>
                </ul>
              </div>
              <div class="space-y-2">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-800">Portals</h4>
                <ul class="space-y-1 text-xs text-slate-600">
                  <li><a href="/${tenant.subdomain}/login" class="text-blue-600 font-semibold hover:underline">Student LMS Login</a></li>
                  <li><a href="/${tenant.subdomain}/admin" class="hover:text-slate-900">Admin Dashboard</a></li>
                </ul>
              </div>
              <div class="space-y-2">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-800">Contact</h4>
                <p class="text-xs text-slate-600">support@${tenant.subdomain}.techmadrasah.app</p>
                <p class="text-xs text-slate-500">© ${new Date().getFullYear()} ${tenant.name}. All rights reserved.</p>
              </div>
            </div>
          </footer>
        `,
      },

      // 11. Layout & Grid Primitives
      {
        id: 'grid-2-col',
        label: makeBlockLabel(
          '2 Columns (50/50)',
          `<rect width="18" height="18" x="3" y="3" rx="2"/><line x1="12" x2="12" y1="3" y2="21"/>`
        ),
        category: 'Layout & Grid',
        content: `
          <div class="py-12 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 class="font-bold text-base text-slate-900 mb-2">Column 1 Content</h3>
              <p class="text-xs text-slate-600">Add your custom text, images, or CTA buttons inside this grid box.</p>
            </div>
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 class="font-bold text-base text-slate-900 mb-2">Column 2 Content</h3>
              <p class="text-xs text-slate-600">Add your custom text, images, or CTA buttons inside this grid box.</p>
            </div>
          </div>
        `,
      },
      {
        id: 'grid-3-col',
        label: makeBlockLabel(
          '3 Columns (33/33/33)',
          `<rect width="18" height="18" x="3" y="3" rx="2"/><line x1="9" x2="9" y1="3" y2="21"/><line x1="15" x2="15" y1="3" y2="21"/>`
        ),
        category: 'Layout & Grid',
        content: `
          <div class="py-12 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 class="font-bold text-sm text-slate-900 mb-1">Feature Box 1</h3>
              <p class="text-xs text-slate-500">Custom description text goes here.</p>
            </div>
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 class="font-bold text-sm text-slate-900 mb-1">Feature Box 2</h3>
              <p class="text-xs text-slate-500">Custom description text goes here.</p>
            </div>
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 class="font-bold text-sm text-slate-900 mb-1">Feature Box 3</h3>
              <p class="text-xs text-slate-500">Custom description text goes here.</p>
            </div>
          </div>
        `,
      },
      {
        id: 'basic-heading',
        label: makeBlockLabel(
          'Heading (H2)',
          `<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>`
        ),
        category: 'Basic Elements',
        content: `<h2 class="text-3xl font-extrabold text-slate-900 font-sans my-4">Section Headline Title</h2>`,
      },
      {
        id: 'basic-paragraph',
        label: makeBlockLabel(
          'Paragraph Text',
          `<line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/>`
        ),
        category: 'Basic Elements',
        content: `<p class="text-sm text-slate-700 leading-relaxed my-2 font-sans">Write your rich explanatory paragraph content here. High accessibility and responsive readability.</p>`,
      },
      {
        id: 'basic-button-cta',
        label: makeBlockLabel(
          'CTA Button',
          `<path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/>`
        ),
        category: 'Basic Elements',
        content: `<a href="#admissions" class="inline-block px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all">Click Here &rarr;</a>`,
      },

      // 12. Course Curriculum Accordion
      {
        id: 'curriculum-accordion-block',
        label: makeBlockLabel(
          'Curriculum Tracks',
          `<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/>`
        ),
        category: 'Curriculum & Tracks',
        content: `
          <section id="curriculum" class="py-20 px-6 sm:px-12 bg-white font-sans border-b border-slate-200">
            <div class="max-w-4xl mx-auto space-y-8">
              <div class="text-center">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wider">Course Syllabus</span>
                <h2 class="text-3xl font-extrabold text-slate-900 mt-2">Comprehensive Learning Curriculum</h2>
                <p class="text-xs sm:text-sm text-slate-500 mt-1">Structured step-by-step tracks designed for beginners to advanced graduates.</p>
              </div>
              <div class="space-y-3">
                <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div class="flex items-center justify-between">
                    <h3 class="font-extrabold text-sm text-slate-900">Module 1: Foundations & Fundamentals</h3>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Weeks 1 - 4</span>
                  </div>
                  <p class="text-xs text-slate-600 mt-1.5">Core principles, oral articulation, and initial prerequisite benchmarks.</p>
                </div>
                <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div class="flex items-center justify-between">
                    <h3 class="font-extrabold text-sm text-slate-900">Module 2: Intermediate Mastery & Live Practicum</h3>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Weeks 5 - 10</span>
                  </div>
                  <p class="text-xs text-slate-600 mt-1.5">Interactive halaqah sessions, live feedback loops, and individual revision logs.</p>
                </div>
                <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div class="flex items-center justify-between">
                    <h3 class="font-extrabold text-sm text-slate-900">Module 3: Advanced Khatmah & Final Sanad Exam</h3>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">Weeks 11 - 16</span>
                  </div>
                  <p class="text-xs text-slate-600 mt-1.5">Complete oral recitation examination, Sanad certification, and graduation honors.</p>
                </div>
              </div>
            </div>
          </section>
        `,
      },

      // 13. Faculty & Teachers Showcase
      {
        id: 'faculty-bios-block',
        label: makeBlockLabel(
          'Faculty Showcase',
          `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`
        ),
        category: 'Social Proof',
        content: `
          <section id="faculty" class="py-20 px-6 sm:px-12 bg-slate-50 font-sans border-b border-slate-200">
            <div class="max-w-6xl mx-auto text-center mb-12">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">Expert Mentors</span>
              <h2 class="text-3xl font-extrabold text-slate-900 mt-2">Learn Directly from Certified Instructors</h2>
              <p class="text-xs sm:text-sm text-slate-500 mt-1">Our faculty are certified with verified chains of transmission (Sanad) and industry experience.</p>
            </div>
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
                <div class="w-20 h-20 mx-auto rounded-full bg-slate-800 text-emerald-400 font-bold text-2xl flex items-center justify-center ring-4 ring-slate-100">AR</div>
                <h3 class="font-extrabold text-base text-slate-900">Shaykh Dr. Abdul Rahman</h3>
                <p class="text-[11px] font-bold text-emerald-700">Senior Sanad Reciter • Al-Azhar Graduate</p>
                <p class="text-xs text-slate-600 leading-relaxed">Over 18 years teaching the 10 Qira'at with connected oral transmission to Prophet Muhammad (ﷺ).</p>
              </div>
              <div class="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
                <div class="w-20 h-20 mx-auto rounded-full bg-slate-800 text-blue-400 font-bold text-2xl flex items-center justify-center ring-4 ring-slate-100">SJ</div>
                <h3 class="font-extrabold text-base text-slate-900">Sarah Jenkins</h3>
                <p class="text-[11px] font-bold text-blue-700">Lead Curriculum Architect • Ex-Google Staff</p>
                <p class="text-xs text-slate-600 leading-relaxed">Full-stack software architect specializing in distributed systems, modern React, and cloud architectures.</p>
              </div>
              <div class="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
                <div class="w-20 h-20 mx-auto rounded-full bg-slate-800 text-purple-400 font-bold text-2xl flex items-center justify-center ring-4 ring-slate-100">TM</div>
                <h3 class="font-extrabold text-base text-slate-900">Ustadh Tariq Mansoor</h3>
                <p class="text-[11px] font-bold text-purple-700">Head of Memorization & Muraja'ah Track</p>
                <p class="text-xs text-slate-600 leading-relaxed">Trained over 400 complete Quran Huffaz across Europe and North America.</p>
              </div>
            </div>
          </section>
        `,
      },

      // 14. Trust Badges & Guarantee
      {
        id: 'trust-badges-bar',
        label: makeBlockLabel(
          'Trust Badges',
          `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`
        ),
        category: 'Social Proof',
        content: `
          <section class="py-10 px-6 sm:px-12 bg-white border-b border-slate-200 font-sans">
            <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center items-center">
              <div class="space-y-1">
                <div class="font-extrabold text-slate-900 text-sm">🔒 100% Secure Checkout</div>
                <p class="text-[10px] text-slate-500">Stripe & 256-bit SSL Encrypted</p>
              </div>
              <div class="space-y-1">
                <div class="font-extrabold text-slate-900 text-sm">📜 Verified Certifications</div>
                <p class="text-[10px] text-slate-500">Accredited Sanad Transmissions</p>
              </div>
              <div class="space-y-1">
                <div class="font-extrabold text-slate-900 text-sm">⚡ Low-Latency WebRTC</div>
                <p class="text-[10px] text-slate-500">Real-Time SFU Video Halaqahs</p>
              </div>
              <div class="space-y-1">
                <div class="font-extrabold text-slate-900 text-sm">✨ 14-Day Guarantee</div>
                <p class="text-[10px] text-slate-500">100% Tuition Satisfaction</p>
              </div>
            </div>
          </section>
        `,
      }
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
          'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Amiri:wght@400;700&display=swap',
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
    
    // Base Canvas CSS for high accessibility and solid black text on white canvas
    const defaultCanvasCss = `
      * { box-sizing: border-box; }
      html, body {
        font-family: 'DM Sans', system-ui, -apple-system, sans-serif !important;
        background-color: #ffffff !important;
        color: #0f172a !important;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: 'DM Sans', sans-serif !important;
        color: #0f172a !important;
        font-weight: 800 !important;
      }
      p, span, li, div, label, input, select, textarea, td, th {
        color: #1e293b;
      }
      .arabic-heading {
        font-family: 'Amiri', serif !important;
        color: #047857 !important;
      }
      a, button, .btn {
        cursor: pointer;
        transition: all 0.2s ease-in-out;
      }
      /* High contrast black text defaults */
      .text-slate-900, .text-black, .text-gray-900 { color: #0f172a !important; }
      .text-slate-800, .text-gray-800, .text-slate-700, .text-gray-700 { color: #1e293b !important; }
      .text-slate-600, .text-gray-600 { color: #475569 !important; }
      .text-slate-500, .text-gray-500 { color: #64748b !important; }
      /* Ensure text inside canvas is always dark unless on dark buttons/badges */
      [data-gjs-type="text"], [data-gjs-type="default"] { color: #0f172a !important; }
      a.btn, button, .bg-blue-600, .bg-emerald-600, .bg-slate-900, .bg-emerald-700, .bg-blue-700 { color: #ffffff !important; }
    `;
    editor.setStyle(tenant.customCss ? `${defaultCanvasCss}\n${tenant.customCss}` : defaultCanvasCss);

    // Direct injection into Canvas iframe document to ensure immediate dark text rendering
    editor.on('load', () => {
      const doc = editor.Canvas.getDocument();
      if (doc) {
        const styleEl = doc.createElement('style');
        styleEl.id = 'tm-canvas-core-contrast';
        styleEl.innerHTML = `
          * { box-sizing: border-box; }
          html, body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            font-family: 'DM Sans', system-ui, -apple-system, sans-serif !important;
            margin: 0;
            padding: 0;
          }
          h1, h2, h3, h4, h5, h6 {
            color: #0f172a !important;
            font-family: 'DM Sans', sans-serif !important;
            font-weight: 800 !important;
          }
          p, span, div, li, td, th, label, input, select, textarea {
            color: #1e293b;
          }
          .text-slate-900, .text-black, .text-gray-900 { color: #0f172a !important; }
          .text-slate-800, .text-gray-800, .text-slate-700, .text-gray-700 { color: #1e293b !important; }
          .text-slate-600, .text-gray-600 { color: #475569 !important; }
          .text-slate-500, .text-gray-500 { color: #64748b !important; }
          [data-gjs-type="text"], [data-gjs-type="default"] { color: #0f172a !important; }
          a.btn, button, .bg-blue-600, .bg-emerald-600, .bg-slate-900, .bg-emerald-700, .bg-blue-700 { color: #ffffff !important; }
        `;
        doc.head.appendChild(styleEl);
      }
    });

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
  }, [tenant.id]);

  // Device switcher handler
  const handleDeviceChange = (device: 'desktop' | 'tablet' | 'mobile') => {
    setSelectedDevice(device);
    if (!editorRef.current) return;
    const iframe = containerRef.current?.querySelector('iframe');
    if (iframe) {
      if (device === 'mobile') {
        iframe.style.width = '375px';
        iframe.style.margin = '0 auto';
        iframe.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
      } else if (device === 'tablet') {
        iframe.style.width = '768px';
        iframe.style.margin = '0 auto';
        iframe.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
      } else {
        iframe.style.width = '100%';
        iframe.style.margin = '0';
        iframe.style.boxShadow = 'none';
      }
    }
  };

  // Apply template from bank
  const handleApplyTemplate = (templateHtml: string) => {
    if (editorRef.current) {
      const defaultForm = tenantForms.find((f) => f.isDefault) || tenantForms[0];
      const fullHtml = `${templateHtml}\n${compileFormToHtml(defaultForm)}`;
      editorRef.current.setComponents(fullHtml);
      setHasUnsavedChanges(true);
      setIsTemplateBankOpen(false);
      onAddToast({
        type: 'info',
        title: 'Template Applied',
        message: 'Template loaded into canvas. Customize content and click Save to publish live.',
      });
    }
  };

  // Save changes to tenant config
  const handleSave = async () => {
    if (!editorRef.current) return;
    setIsSaving(true);

    try {
      const html = editorRef.current.getHtml();
      const css = editorRef.current.getCss();

      await updateTenantConfig({
        customHtml: html,
        customCss: css || '',
      });

      setHasUnsavedChanges(false);
      onAddToast({
        type: 'success',
        title: 'Landing Page Published Live!',
        message: `Your high-accessibility HTML/CSS landing page for ${tenant.name} is now active!`,
      });
    } catch (err: any) {
      onAddToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not save landing page changes.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => editorRef.current?.runCommand('core:undo');
  const handleRedo = () => editorRef.current?.runCommand('core:redo');

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] min-h-[680px] bg-white text-slate-900 rounded-3xl overflow-hidden border border-slate-200 shadow-xl font-sans">
      {/* Block Manager Custom CSS Injection for crisp white cards and big SVG icons */}
      <style>{`
        .gjs-block {
          background: #ffffff !important;
          color: #0f172a !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 14px !important;
          padding: 8px 4px !important;
          margin: 6px 0 !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
          transition: all 0.2s ease-in-out !important;
          cursor: grab !important;
          width: 100% !important;
          min-height: 68px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .gjs-block:hover {
          border-color: #2563eb !important;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.15) !important;
          transform: translateY(-1px) !important;
        }
        .gjs-block-category .gjs-title {
          background: #f8fafc !important;
          color: #334155 !important;
          font-weight: 800 !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          padding: 10px 14px !important;
          border-top: 1px solid #e2e8f0 !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .gjs-cv-canvas {
          background-color: #f1f5f9 !important;
        }
      `}</style>

      {/* 1. TOP BUILDER TOOLBAR (Light Theme, Crisp & Modern) */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 shadow-xs">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-blue-600" />
            <span className="font-extrabold text-sm text-slate-900 hidden sm:inline">Page Builder</span>
          </div>
          {hasUnsavedChanges && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
              Unsaved Edits
            </span>
          )}
        </div>

        {/* Center: Device Switcher Viewports */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => handleDeviceChange('desktop')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              selectedDevice === 'desktop' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDeviceChange('tablet')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              selectedDevice === 'tablet' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDeviceChange('mobile')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              selectedDevice === 'mobile' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleRedo}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsAiPageModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer select-none active:scale-95"
            title="Build Academy Landing Page with AI"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">Build with AI</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTemplateBankOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Templates</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (editorRef.current) {
                setExportedHtml(editorRef.current.getHtml() || '');
                setExportedCss(editorRef.current.getCss() || '');
                setIsExportModalOpen(true);
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
            title="Export Clean HTML/CSS"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-900/10 transition-all cursor-pointer disabled:opacity-50 select-none active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN BUILDER BODY (Light Left Sidepanel + Clean Canvas) */}
      <div className="flex-1 flex overflow-hidden min-w-0 bg-slate-50">
        {/* Left Sidepanel: Block Library & Tabs */}
        <div className="w-72 sm:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden shadow-xs">
          {/* Sidepanel Tabs */}
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Drag & Drop Blocks</span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold bg-slate-200/80 px-2 py-0.5 rounded-full">28+ Blocks</span>
          </div>

          {/* GrapesJS Rendered Block Container */}
          <div
            ref={blocksContainerRef}
            className="flex-1 p-3 overflow-y-auto space-y-2 text-xs scrollbar-thin scrollbar-thumb-slate-300"
          />

          {/* Bottom Quick Help */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Drag blocks onto the canvas. Click text to edit in-line.</span>
          </div>
        </div>

        {/* Right: GrapesJS Visual Canvas */}
        <div className="flex-1 flex flex-col relative bg-slate-100 overflow-hidden">
          <div
            ref={containerRef}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* 3. TEMPLATE BANK MODAL (Light Theme) */}
      {isTemplateBankOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Pre-Built Designs</span>
                <h3 className="text-base font-extrabold text-slate-900">Choose Academy Landing Page Template</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateBankOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-300/60 text-slate-700 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
              {TEMPLATE_BANK.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col justify-between space-y-4 hover:border-blue-400 hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                      <img src={tmpl.previewImg} alt={tmpl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-md">
                        {tmpl.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{tmpl.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tmpl.description}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl.html)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Apply Template to Canvas
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. EXPORT HTML & CSS MODAL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150 font-sans">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Export & Integration</span>
                <h3 className="text-base font-extrabold text-slate-900">Export Clean HTML & CSS</h3>
                <p className="text-xs text-slate-500">Standalone, semantic, high-accessibility code ready for hosting or static export.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-300/60 text-slate-700 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Shareable Link Banner */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-blue-900 text-xs">Direct Shareable Academy URL:</div>
                  <div className="font-mono text-blue-700 text-[11px]">https://{tenant.subdomain}.techmadrasah.app</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://${tenant.subdomain}.techmadrasah.app`);
                    onAddToast({ type: 'success', title: 'Link Copied', message: 'Shareable academy URL copied to clipboard!' });
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Public URL
                </button>
              </div>

              {/* Code Previews */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase text-[10px]">Compiled HTML ({Math.round(exportedHtml.length / 1024)} KB)</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(exportedHtml);
                      onAddToast({ type: 'success', title: 'HTML Copied', message: 'Complete page HTML copied to clipboard.' });
                    }}
                    className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copy HTML
                  </button>
                </div>
                <textarea
                  readOnly
                  value={exportedHtml}
                  rows={8}
                  className="w-full p-3 font-mono text-[11px] bg-slate-900 text-slate-100 rounded-xl focus:outline-none scrollbar-thin"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase text-[10px]">Canvas CSS</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(exportedCss);
                      onAddToast({ type: 'success', title: 'CSS Copied', message: 'CSS stylesheet copied to clipboard.' });
                    }}
                    className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copy CSS
                  </button>
                </div>
                <textarea
                  readOnly
                  value={exportedCss}
                  rows={4}
                  className="w-full p-3 font-mono text-[11px] bg-slate-900 text-slate-100 rounded-xl focus:outline-none scrollbar-thin"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([exportedHtml], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${tenant.subdomain}_landing_page.html`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  onAddToast({ type: 'success', title: 'HTML File Downloaded', message: 'Downloaded landing page HTML file.' });
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download .html File
              </button>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. BUILD WITH AI MODAL */}
      {isAiPageModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150 font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                  <Wand2 className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Build Academy Landing Page with AI</h3>
                  <p className="text-[11px] text-slate-500">Describe your academy or choose a preset to auto-generate a high-converting layout.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiPageModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                &times;
              </button>
            </div>

            {/* Presets Grid */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Quick Presets:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAiFocus('Authentic Quran Memorization, Tajweed Rules & Al-Azhar Sanad Khatmah');
                    setAiAudience('Adults, Youth & Reverts');
                    setAiHighlight('Daily Live 1-on-1 Recitation with WebRTC Audio Looper');
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 text-left transition-all text-xs cursor-pointer"
                >
                  <div className="font-bold text-slate-900">🌟 Quran & Sanad Academy</div>
                  <div className="text-[10px] text-slate-500">Tajweed, Hifz, and verified chain</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAiFocus('Full-Stack Cloud Software Engineering & AI Systems');
                    setAiAudience('Aspiring Developers & Tech Career Changers');
                    setAiHighlight('Project-Based Live Coding with 1-on-1 Code Reviews');
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition-all text-xs cursor-pointer"
                >
                  <div className="font-bold text-slate-900">💻 Software Bootcamp</div>
                  <div className="text-[10px] text-slate-500">Next.js, TypeScript & Cloud</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAiFocus('Youth Weekend Quran & Islamic Foundations School');
                    setAiAudience('Children Aged 6-16 Years');
                    setAiHighlight('Interactive Gamified Halaqahs & Character Building');
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all text-xs cursor-pointer"
                >
                  <div className="font-bold text-slate-900">🕌 Weekend Islamic School</div>
                  <div className="text-[10px] text-slate-500">Youth character & Quran fluency</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAiFocus('Intensive Summer Khatmah & Arabic Immersion Camp');
                    setAiAudience('Youth & University Students');
                    setAiHighlight('Accelerated 6-Week Memorization with Mentorship');
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-all text-xs cursor-pointer"
                >
                  <div className="font-bold text-slate-900">📖 Accelerated Camp</div>
                  <div className="text-[10px] text-slate-500">Summer intensive immersion</div>
                </button>
              </div>
            </div>

            {/* Custom Inputs */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Academy Focus & Headline Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Master Authentic Quran Memorization with Verified Sanad"
                  value={aiFocus}
                  onChange={(e) => setAiFocus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Target Students</label>
                  <input
                    type="text"
                    placeholder="e.g. Beginners & Advanced Youth"
                    value={aiAudience}
                    onChange={(e) => setAiAudience(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Key Feature Highlight</label>
                  <input
                    type="text"
                    placeholder="e.g. 1-on-1 Daily Live Recitation"
                    value={aiHighlight}
                    onChange={(e) => setAiHighlight(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsAiPageModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGeneratePageWithAi}
                disabled={isGeneratingWithAi}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer text-xs flex items-center gap-2 disabled:opacity-50 select-none active:scale-95"
              >
                <Wand2 className="w-4 h-4 text-amber-300" />
                <span>{isGeneratingWithAi ? 'Compiling AI Layout...' : 'Generate Page with AI'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
