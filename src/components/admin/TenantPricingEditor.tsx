import React, { useState } from 'react';
import { PricingPlan } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Button, Input, Card, Badge } from '../ui';
import { Plus, Edit3, Trash2, Check, Save } from 'lucide-react';

interface TenantPricingEditorProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const TenantPricingEditor: React.FC<TenantPricingEditorProps> = ({ onAddToast }) => {
  const { tenant, updateTenantConfig } = useTenant();
  const [plans, setPlans] = useState<PricingPlan[]>(tenant.pricingPlans || []);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

  const handleAddPlan = () => {
    const newPlan: PricingPlan = {
      id: `plan-${Date.now()}`,
      name: 'Standard Track',
      nameAr: 'المسار الدراسي العام',
      description: '2 live interactive sessions weekly with tutor feedback',
      descriptionAr: 'حصتان أسبوعياً مع المتابعة الفردية',
      priceMonthly: 75,
      priceYearly: 750,
      currency: 'USD',
      features: ['2 Live Sessions Weekly', 'Homework Audio Feedback', 'Student Portal Access'],
    };

    const updated = [...plans, newPlan];
    setPlans(updated);
    updateTenantConfig({ pricingPlans: updated });
    onAddToast({ type: 'success', title: 'Tuition Plan Added', message: 'New student plan added to academy options.' });
  };

  const handleDeletePlan = (id: string) => {
    const updated = plans.filter((p) => p.id !== id);
    setPlans(updated);
    updateTenantConfig({ pricingPlans: updated });
    onAddToast({ type: 'info', title: 'Plan Removed', message: 'Tuition tier deleted.' });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    const updated = plans.map((p) => (p.id === editingPlan.id ? editingPlan : p));
    setPlans(updated);
    updateTenantConfig({ pricingPlans: updated });
    onAddToast({ type: 'success', title: 'Plan Updated', message: 'Tuition tier details saved.' });
    setEditingPlan(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Card */}
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Tuition & Pricing Plans</h2>
          <p className="text-xs text-slate-500 mt-0.5">Configure subscription fee tiers displayed on your public academy landing page.</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleAddPlan}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Tuition Plan
        </Button>
      </Card>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col justify-between relative ${
              plan.popular ? 'border-slate-900 ring-1 ring-slate-900 shadow-md' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-2.5 right-4">
                <Badge variant="success">Featured</Badge>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">{plan.name}</h3>
                <span className="text-xs text-slate-400 font-semibold">{plan.nameAr}</span>
              </div>

              <p className="text-xs text-slate-500 mt-1">{plan.description}</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-slate-900">${plan.priceMonthly}</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>

              <ul className="mt-5 space-y-2 text-xs text-slate-600">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingPlan(plan)}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleDeletePlan(plan.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Edit Tuition Plan</h3>
              <button onClick={() => setEditingPlan(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Plan Name (English)</label>
                  <input
                    type="text"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">اسم المسار (العربية)</label>
                  <input
                    type="text"
                    value={editingPlan.nameAr}
                    onChange={(e) => setEditingPlan({ ...editingPlan, nameAr: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-sm font-arabic"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Price ($ USD)</label>
                  <input
                    type="number"
                    value={editingPlan.priceMonthly}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceMonthly: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Annual Price ($ USD)</label>
                  <input
                    type="number"
                    value={editingPlan.priceYearly}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceYearly: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Features Included (Comma Separated)</label>
                <textarea
                  rows={3}
                  value={editingPlan.features.join(', ')}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      features: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingPlan.popular || false}
                  onChange={(e) => setEditingPlan({ ...editingPlan, popular: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded-sm"
                />
                <label className="font-semibold text-slate-700">Mark as Featured / Most Popular Tier</label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white font-bold rounded-sm shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
