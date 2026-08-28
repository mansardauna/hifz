import React, { useState } from 'react';
import { PageBlock } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Plus, Trash2, ArrowUp, ArrowDown, Copy, Edit3, Palette, Layout, Save, CheckCircle2, Eye, Sparkles, BookOpen, Layers } from 'lucide-react';

interface VisualPageBuilderProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const VisualPageBuilder: React.FC<VisualPageBuilderProps> = ({ onAddToast }) => {
  const { tenant, updateTenantConfig, language, direction } = useTenant();
  const [blocks, setBlocks] = useState<PageBlock[]>(tenant.pageBlocks || []);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(blocks[0]?.id || null);

  const isAr = language === 'ar';
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  const blockTemplates = [
    { type: 'hero' as const, label: 'Hero Banner', icon: Layout, title: 'Preserving Sacred Quranic Knowledge', titleAr: 'حفظ كتاب الله بالسند المتصل' },
    { type: 'calligraphy' as const, label: 'Quran Verse Calligraphy', icon: Sparkles, title: 'Verily We Have Sent Down The Quran', titleAr: 'إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ' },
    { type: 'courses' as const, label: 'Featured Courses Showcase', icon: BookOpen, title: 'Featured Quranic Programs', titleAr: 'المناهج والدورات المتاحة' },
    { type: 'form' as const, label: 'Admissions Form Anchor', icon: Layers, title: 'Direct Admissions Application', titleAr: 'نموذج الالتحاق المباشر' },
  ];

  const handleAddBlock = (templateType: 'hero' | 'calligraphy' | 'courses' | 'form') => {
    const tmpl = blockTemplates.find((t) => t.type === templateType)!;
    const newBlock: PageBlock = {
      id: `blk-${Date.now()}`,
      type: templateType,
      title: tmpl.title,
      titleAr: tmpl.titleAr,
      content: 'Custom section description text here...',
      contentAr: 'أضف وصف القسم هنا...',
      style: { backgroundColor: '#ffffff', textColor: '#0f172a', paddingY: 'py-16' },
    };

    const updated = [...blocks, newBlock];
    setBlocks(updated);
    setSelectedBlockId(newBlock.id);
    updateTenantConfig({ pageBlocks: updated });
    onAddToast({
      type: 'success',
      title: 'Block Added to Canvas',
      message: `Added new ${tmpl.label} block.`,
    });
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setBlocks(updated);
    updateTenantConfig({ pageBlocks: updated });
  };

  const handleDeleteBlock = (id: string) => {
    const updated = blocks.filter((b) => b.id !== id);
    setBlocks(updated);
    if (selectedBlockId === id) setSelectedBlockId(updated[0]?.id || null);
    updateTenantConfig({ pageBlocks: updated });
    onAddToast({ type: 'info', title: 'Block Removed', message: 'Section removed from landing page canvas.' });
  };

  const handleUpdateBlock = (id: string, updates: Partial<PageBlock>) => {
    const updated = blocks.map((b) => (b.id === id ? { ...b, ...updates } : b));
    setBlocks(updated);
    updateTenantConfig({ pageBlocks: updated });
  };

  return (
    <div className="space-y-6" dir={direction}>
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className={`text-2xl font-bold text-slate-900 ${isAr ? 'font-arabic text-3xl' : ''}`}>
            {isAr ? 'محرر الصفحات المرئي (GrapesJS Canvas)' : 'Visual Page Builder (GrapesJS Canvas)'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isAr ? 'سحب وإضافة وتنسيق الأقسام البصرية مباشرة على واجهة الصفحة الرئيسية' : 'Drag-and-drop visual layout blocks, edit section content inline, and customize site styling.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onAddToast({ type: 'success', title: 'Page Published!', message: 'All block changes saved to live tenant site.' })}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish Site Layout</span>
          </button>
        </div>
      </div>

      {/* 3-Column Visual Builder Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Block Library Palette */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isAr ? 'مكتبة الأقسام والقوالب' : 'Visual Block Library'}
          </h3>

          <div className="space-y-2.5">
            {blockTemplates.map((tmpl) => {
              const Icon = tmpl.icon;

              return (
                <button
                  key={tmpl.type}
                  onClick={() => handleAddBlock(tmpl.type)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/50 text-slate-800 font-bold text-xs transition-all flex items-center gap-3 text-start shadow-sm"
                >
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-teal-600 shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{tmpl.label}</p>
                    <p className="text-[10px] text-slate-400 font-normal">Click to insert into canvas</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Column: Live Visual Canvas */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 p-3 rounded-xl text-slate-300 text-xs font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Interactive Page Canvas ({blocks.length} Sections)
            </span>
            <span className="text-slate-500">Live Drag Preview</span>
          </div>

          <div className="bg-slate-200 p-4 rounded-2xl space-y-4 min-h-[500px]">
            {blocks.map((block, idx) => {
              const isSelected = selectedBlockId === block.id;

              return (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`relative rounded-2xl p-6 transition-all cursor-pointer border-2 ${
                    isSelected
                      ? 'border-teal-500 ring-4 ring-teal-500/20 shadow-xl'
                      : 'border-transparent hover:border-slate-400'
                  }`}
                  style={{ backgroundColor: block.style?.backgroundColor || '#ffffff', color: block.style?.textColor || '#0f172a' }}
                >
                  {/* Block Hover Action Toolbar */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-900/90 text-white p-1 rounded-lg shadow z-10 text-[11px]">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveBlock(idx, 'up'); }}
                      disabled={idx === 0}
                      className="p-1 hover:text-teal-400 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveBlock(idx, 'down'); }}
                      disabled={idx === blocks.length - 1}
                      className="p-1 hover:text-teal-400 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}
                      className="p-1 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Block Canvas Content Preview */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-600 bg-teal-100 px-2 py-0.5 rounded">
                      Section: {block.type}
                    </span>

                    {block.type === 'calligraphy' ? (
                      <div className="text-center py-6">
                        <h3 className="font-arabic text-3xl font-bold leading-relaxed">{block.titleAr}</h3>
                        <p className="text-xs opacity-75 font-sans mt-2">{block.title}</p>
                      </div>
                    ) : (
                      <div>
                        <h3 className={`text-xl font-bold ${isAr ? 'font-arabic text-2xl' : ''}`}>
                          {isAr ? block.titleAr : block.title}
                        </h3>
                        <p className="text-xs opacity-80 mt-1 leading-relaxed">
                          {isAr ? block.contentAr : block.content}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Style & Content Inspector */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isAr ? 'خصائص القسم المعدد' : 'Section Property Inspector'}
          </h3>

          {selectedBlock ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Section Title (English)</label>
                <input
                  type="text"
                  value={selectedBlock.title}
                  onChange={(e) => handleUpdateBlock(selectedBlock.id, { title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان القسم (بالعربية)</label>
                <input
                  type="text"
                  value={selectedBlock.titleAr}
                  onChange={(e) => handleUpdateBlock(selectedBlock.id, { titleAr: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-arabic text-base"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description Content</label>
                <textarea
                  rows={3}
                  value={selectedBlock.content}
                  onChange={(e) => handleUpdateBlock(selectedBlock.id, { content: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <label className="block font-bold text-slate-700">Background Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={selectedBlock.style?.backgroundColor || '#ffffff'}
                    onChange={(e) =>
                      handleUpdateBlock(selectedBlock.id, {
                        style: { ...selectedBlock.style, backgroundColor: e.target.value },
                      })
                    }
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                  />
                  <span className="font-mono text-slate-500">{selectedBlock.style?.backgroundColor}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic text-center py-8">Select a block on the canvas to inspect properties.</p>
          )}
        </div>
      </div>
    </div>
  );
};
