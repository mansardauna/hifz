'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Puck, Data } from '@measured/puck';
import '@measured/puck/dist/index.css';
import { useTenant } from '../../context/TenantContext';
import { useToast } from '../../context/ToastContext';
import { createPuckConfig, ComponentProps, PuckRootProps } from './puckConfig';
import { PUCK_TEMPLATES, PuckTemplateMeta } from './puckTemplates';
import { StudentEnrollmentModal } from '../checkout/StudentEnrollmentModal';
import { PricingPlan } from '../../types';
import {
  Sparkles,
  Save,
  RotateCcw,
  Layout,
  Layers,
  Eye,
  CheckCircle2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Button } from '../ui';

export const PuckPageBuilderStudio: React.FC = () => {
  const { tenant, updateTenantConfig, courses, direction } = useTenant();
  const { success, info } = useToast();

  const [selectedPlanForEnroll, setSelectedPlanForEnroll] = useState<PricingPlan | null>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [activeTemplateKey, setActiveTemplateKey] = useState<string>('quran_madrasah');

  // Determine initial data
  const initialData: Data<ComponentProps, PuckRootProps> = useMemo(() => {
    if (tenant.builderLayout?.content && Array.isArray(tenant.builderLayout.content) && tenant.builderLayout.content.length > 0) {
      return tenant.builderLayout as Data<ComponentProps, PuckRootProps>;
    }
    return PUCK_TEMPLATES.quran_madrasah.data;
  }, [tenant.builderLayout]);

  const [puckData, setPuckData] = useState<Data<ComponentProps, PuckRootProps>>(initialData);

  // Sync when tenant changes
  useEffect(() => {
    if (tenant.builderLayout?.content && Array.isArray(tenant.builderLayout.content) && tenant.builderLayout.content.length > 0) {
      setPuckData(tenant.builderLayout as Data<ComponentProps, PuckRootProps>);
    }
  }, [tenant.subdomain]);

  const handleEnroll = (plan: PricingPlan) => {
    setSelectedPlanForEnroll(plan);
    setIsEnrollModalOpen(true);
  };

  const handleSubmitForm = async (formData: Record<string, any>, formId: string, formTitle: string) => {
    setIsSubmittingForm(true);
    try {
      if (typeof window !== 'undefined') {
        const newResp = {
          id: `resp-${Date.now()}`,
          formId,
          formTitle,
          studentName: formData.studentName || 'Applicant',
          email: formData.email || '',
          phone: formData.phone || '',
          submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          status: 'New',
          data: formData,
          notes: `Submitted via ${formTitle}`
        };
        const existing = JSON.parse(localStorage.getItem(`tenant_form_responses_${tenant.subdomain}`) || '[]');
        localStorage.setItem(`tenant_form_responses_${tenant.subdomain}`, JSON.stringify([newResp, ...existing]));
      }
      success('Form Response Saved', 'Your application response was recorded.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const puckConfig = useMemo(
    () =>
      createPuckConfig({
        tenant,
        courses,
        onEnroll: handleEnroll,
        onSubmitForm: handleSubmitForm,
        isSubmittingForm,
      }),
    [tenant, courses, isSubmittingForm]
  );

  const handlePublish = (data: Data<ComponentProps, PuckRootProps>) => {
    setPuckData(data);
    updateTenantConfig({
      builderLayout: data,
    });
    success('Landing Page Published! 🚀', 'Your visual layout has been published live to your subdomain.');
  };

  const handleApplyPreset = (key: string) => {
    const preset = PUCK_TEMPLATES[key];
    if (preset) {
      setActiveTemplateKey(key);
      setPuckData(JSON.parse(JSON.stringify(preset.data)));
      info('Template Loaded', `Applied "${preset.name}" visual template to canvas.`);
    }
  };

  return (
    <div className="space-y-4 font-sans" dir="ltr">
      {/* Studio Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>Visual Canvas Page Builder (Puck Studio)</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase border border-emerald-200">
                Live React Canvas
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Drag, reorder, click to edit inline, and customize high-converting landing pages with zero code.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Template Preset Dropdown */}
          <div className="relative">
            <select
              value={activeTemplateKey}
              onChange={(e) => handleApplyPreset(e.target.value)}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:border-emerald-600 transition-colors"
            >
              {Object.entries(PUCK_TEMPLATES).map(([key, tpl]) => (
                <option key={key} value={key}>
                  {tpl.icon} {tpl.name}
                </option>
              ))}
            </select>
          </div>

          <a
            href={`/${tenant.subdomain}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>View Live</span>
          </a>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handlePublish(puckData)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            <span>Publish Live</span>
          </Button>
        </div>
      </div>

      {/* Puck Editor Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[750px] relative">
        <Puck
          config={puckConfig}
          data={puckData}
          onPublish={handlePublish}
          onChange={(newData) => setPuckData(newData)}
        />
      </div>

      {/* Checkout Modal */}
      {selectedPlanForEnroll && (
        <StudentEnrollmentModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          selectedPlan={selectedPlanForEnroll}
          onAddToast={(t) => info(t.title || 'Notification', t.message)}
        />
      )}
    </div>
  );
};
