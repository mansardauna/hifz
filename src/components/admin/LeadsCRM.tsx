import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, PaymentStatus } from '../../types';
import { api } from '../../services/api';
import { useTenant } from '../../context/TenantContext';
import { LeadDetailModal } from './LeadDetailModal';
import { ToastMessage } from '../ui/Toast';
import { Search, Filter, CheckCircle, UserCheck, Clock, FileText, ChevronRight, Mail, Phone, CreditCard, ChevronDown } from 'lucide-react';

interface LeadsCRMProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const LeadsCRM: React.FC<LeadsCRMProps> = ({ onAddToast }) => {
  const { tenant, language, direction } = useTenant();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const isAr = language === 'ar';

  const fetchLeads = async () => {
    const data = await api.getLeads(tenant.id);
    setLeads(data);
  };

  useEffect(() => {
    fetchLeads();
  }, [tenant.id]);

  const handleUpdateLeadState = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      (lead.studentName || lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    const matchesPayment = paymentFilter === 'ALL' || lead.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">New</span>;
      case 'Under Review':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Under Review</span>;
      case 'Interview':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">Interview</span>;
      case 'Admitted':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Admitted</span>;
      case 'Rejected':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">Rejected</span>;
    }
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">✓ Paid</span>;
      case 'Pending':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">⏳ Pending</span>;
      case 'Past Due':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">⚠ Past Due</span>;
      case 'Exempt':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Exempt</span>;
    }
  };

  return (
    <div className="space-y-5 font-sans" dir={direction}>
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-md border border-slate-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900">Student Admissions & Tuition CRM</h2>
          <p className="text-xs text-slate-500 mt-1">Review student applications, track tuition payment plans, and manage interview workflows.</p>
        </div>

        <div className="text-xs text-slate-600 font-semibold bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 self-start sm:self-auto">
          Total Students: <span className="font-bold text-slate-900">{leads.length}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-md border border-slate-200 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
          <input
            type="text"
            placeholder="Search student name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs with Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
            <div className="flex items-center border border-slate-200 rounded-md p-0.5 bg-slate-50 text-xs whitespace-nowrap">
              {['ALL', 'New', 'Under Review', 'Interview', 'Admitted'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    statusFilter === status ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-300 text-xs font-semibold bg-white text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="Paid">Tuition: Paid</option>
            <option value="Pending">Tuition: Pending</option>
            <option value="Past Due">Tuition: Past Due</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-md border border-slate-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-slate-700 min-w-[650px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px] font-display">
              <tr>
                <th className="p-3.5 text-start">Student Profile</th>
                <th className="p-3.5 text-start">Program Interest</th>
                <th className="p-3.5 text-start">Tuition Plan & Fee</th>
                <th className="p-3.5 text-start">Tuition Status</th>
                <th className="p-3.5 text-start">Workflow Status</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No student applications match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="p-3.5">
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{lead.studentName || lead.name}</p>
                        <div className="flex flex-wrap items-center gap-2 text-slate-400 text-[10px] mt-0.5">
                          <span>{lead.email}</span>
                          <span>•</span>
                          <span>{lead.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-semibold text-slate-800">{lead.courseInterest}</td>

                    <td className="p-3.5">
                      <p className="font-bold text-slate-900 text-xs">{lead.planName || lead.selectedPlanName || 'Foundational Track'}</p>
                      <p className="text-[10px] text-slate-500 font-mono">${lead.planPrice || lead.tuitionAmount || 65} / {lead.billingCycle || 'mo'}</p>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">{getPaymentBadge(lead.paymentStatus)}</td>

                    <td className="p-3.5 whitespace-nowrap">{getStatusBadge(lead.status)}</td>

                    <td className="p-3.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-display rounded-md text-xs transition-colors cursor-pointer"
                      >
                        View Dossier
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Lead Profile Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdateLead={handleUpdateLeadState}
          onAddToast={onAddToast}
        />
      )}
    </div>
  );
};
