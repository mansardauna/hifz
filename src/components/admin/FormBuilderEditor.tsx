import React, { useState } from 'react';
import { FormFieldConfig } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Plus, Trash2, Edit3, FileText, CheckSquare, Save, GripVertical } from 'lucide-react';

interface FormBuilderEditorProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const FormBuilderEditor: React.FC<FormBuilderEditorProps> = ({ onAddToast }) => {
  const { tenant, updateCustomFormFields, language, direction } = useTenant();
  const [fields, setFields] = useState<FormFieldConfig[]>(tenant.customFormFields);
  const [editingField, setEditingField] = useState<FormFieldConfig | null>(null);

  const isAr = language === 'ar';

  const handleAddField = () => {
    const newField: FormFieldConfig = {
      id: `field_${Date.now()}`,
      label: 'New Questionnaire Question',
      labelAr: 'سؤال استبيان جديد',
      type: 'text',
      required: false,
    };
    const updated = [...fields, newField];
    setFields(updated);
    updateCustomFormFields(updated);
    onAddToast({
      type: 'success',
      title: isAr ? 'تمت إضافة حقل جديد' : 'New Form Field Added',
      message: isAr ? 'تمت إضافة الحقل بنجاح إلى نموذج التقديم' : 'Field added to admissions form.',
    });
  };

  const handleDeleteField = (id: string) => {
    const updated = fields.filter((f) => f.id !== id);
    setFields(updated);
    updateCustomFormFields(updated);
    onAddToast({
      type: 'info',
      title: isAr ? 'تم حذف الحقل' : 'Field Removed',
      message: isAr ? 'تم إزالة الحقل من النموذج' : 'Field removed from questionnaire.',
    });
  };

  const handleSaveField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingField) return;

    const updated = fields.map((f) => (f.id === editingField.id ? editingField : f));
    setFields(updated);
    updateCustomFormFields(updated);
    onAddToast({
      type: 'success',
      title: isAr ? 'تم حفظ الحقل' : 'Field Configurations Saved',
      message: isAr ? 'تم تحديث خيارات الحقل على نموذج التواصل' : 'Admissions form custom question updated.',
    });
    setEditingField(null);
  };

  return (
    <div className="space-y-6" dir={direction}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className={`text-2xl font-bold text-slate-900 ${isAr ? 'font-arabic text-3xl' : ''}`}>
            {isAr ? 'منشئ نماذج التواصل والقبول' : 'Admissions & Contact Form Builder'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isAr ? 'تخصيص أسئلة الاستبيان وإضافة أسئلة اختيارية أو إجبارية للطلاب المسجلين' : 'Customize custom questionnaire fields, required rules, and dropdown options on your admissions form.'}
          </p>
        </div>

        <button
          onClick={handleAddField}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة حقل استبيان' : 'Add Custom Field'}</span>
        </button>
      </div>

      {/* Fields List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {isAr ? 'الحقول المخصصة الحالية' : 'Active Form Questionnaire Fields'}
        </h3>

        {fields.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center border border-dashed border-slate-200 rounded-xl">
            {isAr ? 'لا توجد أسئلة مخصصة حتى الآن. انقر على إضافة حقل استبيان.' : 'No custom fields configured yet. Click "Add Custom Field" above.'}
          </p>
        ) : (
          <div className="space-y-3">
            {fields.map((field) => (
              <div
                key={field.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs text-slate-900">{field.label}</p>
                      <span className="text-[10px] text-slate-500">({field.labelAr})</span>
                      {field.required && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Type: {field.type} {field.options ? `• ${field.options.length} options` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingField(field)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Field Modal */}
      {editingField && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {isAr ? 'تخصيص الحقل' : 'Configure Form Field'}
              </h3>
              <button onClick={() => setEditingField(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveField} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Field Label (English)</label>
                <input
                  type="text"
                  value={editingField.label}
                  onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان الحقل (بالعربية)</label>
                <input
                  type="text"
                  value={editingField.labelAr}
                  onChange={(e) => setEditingField({ ...editingField, labelAr: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-arabic text-base"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Input Type</label>
                  <select
                    value={editingField.type}
                    onChange={(e) => setEditingField({ ...editingField, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="text">Text Input</option>
                    <option value="select">Dropdown Select</option>
                    <option value="phone">Phone Number</option>
                    <option value="email">Email Input</option>
                    <option value="textarea">Text Area</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={editingField.required}
                      onChange={(e) => setEditingField({ ...editingField, required: e.target.checked })}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span>Required Field</span>
                  </label>
                </div>
              </div>

              {editingField.type === 'select' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dropdown Options (Comma Separated)</label>
                  <textarea
                    rows={2}
                    value={editingField.options ? editingField.options.join(', ') : ''}
                    onChange={(e) =>
                      setEditingField({
                        ...editingField,
                        options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Option 1, Option 2, Option 3"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-md"
                >
                  Save Field Configurations
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
