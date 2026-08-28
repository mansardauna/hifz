import React, { useState } from 'react';
import { Lead, LeadStatus, PaymentStatus } from '../../types';
import { api } from '../../services/api';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { X, UserCheck, Calendar, Phone, Mail, Award, Clock, FileText, CheckCircle2, AlertCircle, Sparkles, MessageSquare, History, CreditCard, Download, Receipt } from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdateLead: (updatedLead: Lead) => void;
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onUpdateLead,
  onAddToast,
}) => {
  const { tenant, language, direction } = useTenant();
  const [notes, setNotes] = useState<string>(lead.notes || '');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(lead.paymentStatus || 'Pending');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const isAr = language === 'ar';

  const handleStatusChange = async (newStatus: LeadStatus) => {
    setIsSaving(true);
    try {
      const updated = await api.updateLeadStatus(lead.id, newStatus, notes);
      const withPayment = { ...updated, paymentStatus };
      onUpdateLead(withPayment);
      onAddToast({
        type: 'success',
        title: 'Status Updated',
        message: `Student status updated to ${newStatus}.`,
      });
      onClose();
    } catch (err) {
      onAddToast({ type: 'error', title: 'Update Failed', message: 'Could not update student lead status.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePaymentStatusToggle = (newPaymentStatus: PaymentStatus) => {
    setPaymentStatus(newPaymentStatus);
    onUpdateLead({ ...lead, paymentStatus: newPaymentStatus });
    onAddToast({
      type: 'success',
      title: 'Payment Status Updated',
      message: `Tuition status marked as ${newPaymentStatus}.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans" dir={direction}>
      <div className="bg-white rounded-sm max-w-2xl w-full p-6 sm:p-8 shadow-xl border border-slate-200 animate-in fade-in duration-150 my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-sm bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xl flex items-center justify-center">
              {lead.studentName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900">{lead.studentName}</h3>
                <span className="px-2 py-0.5 rounded-sm text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {lead.status}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-sm text-[11px] font-bold ${
                    paymentStatus === 'Paid'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : paymentStatus === 'Pending'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  Tuition: {paymentStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">ID: {lead.id} • Applied {new Date(lead.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-5 space-y-5 text-xs text-slate-700">
          {/* Quick Contact Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-sm border border-slate-200">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Email</p>
              <p className="font-bold text-slate-900 truncate mt-0.5">{lead.email}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">WhatsApp Phone</p>
              <p className="font-bold text-slate-900 truncate mt-0.5">{lead.phone}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Arabic Level</p>
              <p className="font-bold text-slate-900 truncate mt-0.5">{lead.arabicLevel}</p>
            </div>
          </div>

          {/* Student Tuition & Subscription Details */}
          <div className="p-4 rounded-sm bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-700" />
                <span className="font-bold text-slate-900 text-xs">Tuition & Subscription Plan</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">Gateway: {lead.paymentGateway || 'Stripe Connect'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 block">Enrolled Plan:</span>
                <span className="font-bold text-slate-900">{lead.planName || 'Foundational Tajweed'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Plan Fee:</span>
                <span className="font-bold text-slate-900">${lead.planPrice || 65} / {lead.billingCycle || 'Month'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Last Payment:</span>
                <span className="font-bold text-slate-900">
                  {lead.invoices?.[0]?.paymentDate || lead.invoices?.[0]?.paidAt || '2026-08-26'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Next Renewal:</span>
                <span className="font-bold text-slate-900">2026-09-26</span>
              </div>
            </div>

            {/* Payment Status Overrides */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200/60">
              <span className="text-slate-500 font-medium">Update Tuition Status:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePaymentStatusToggle('Paid')}
                  className={`px-2.5 py-1 rounded-sm text-[10px] font-bold border transition-colors ${
                    paymentStatus === 'Paid' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  ✓ Mark Paid
                </button>
                <button
                  onClick={() => handlePaymentStatusToggle('Pending')}
                  className={`px-2.5 py-1 rounded-sm text-[10px] font-bold border transition-colors ${
                    paymentStatus === 'Pending' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  ⏳ Pending
                </button>
                <button
                  onClick={() => handlePaymentStatusToggle('Past Due')}
                  className={`px-2.5 py-1 rounded-sm text-[10px] font-bold border transition-colors ${
                    paymentStatus === 'Past Due' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  ⚠ Past Due
                </button>
              </div>
            </div>
          </div>


          {/* Custom Form Answers from Notes field */}
          {lead.notes && (
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Admissions Notes & Questionnaire</h4>
              <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
                <p className="text-xs text-slate-700 leading-relaxed">{lead.notes}</p>
              </div>
            </div>
          )}


          {/* Internal Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Admissions Board Notes:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add interview scoring, oral evaluation notes, or scholarship remarks..."
              className="w-full p-2.5 rounded-sm border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusChange('Under Review')}
              disabled={isSaving}
              className="px-3 py-2 rounded-sm bg-amber-50 text-amber-900 font-bold border border-amber-200 hover:bg-amber-100 text-xs"
            >
              Set Under Review
            </button>
            <button
              onClick={() => handleStatusChange('Interview')}
              disabled={isSaving}
              className="px-3 py-2 rounded-sm bg-purple-50 text-purple-900 font-bold border border-purple-200 hover:bg-purple-100 text-xs"
            >
              Schedule Interview
            </button>
          </div>

          <button
            onClick={() => handleStatusChange('Admitted')}
            disabled={isSaving}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-sm shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4" />
            <span>Approve & Admit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
