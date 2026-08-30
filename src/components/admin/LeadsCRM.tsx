import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, PaymentStatus } from '../../types';
import { api } from '../../services/api';
import { useTenant } from '../../context/TenantContext';
import { LeadDetailModal } from './LeadDetailModal';
import { ToastMessage } from '../ui/Toast';
import {
  Button,
  Input,
  Select,
  Card,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '../ui';
import { Search } from 'lucide-react';

interface LeadsCRMProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const LeadsCRM: React.FC<LeadsCRMProps> = ({ onAddToast }) => {
  const { tenant, direction } = useTenant();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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

  const renderStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return <Badge variant="info">New</Badge>;
      case 'Under Review':
        return <Badge variant="warning">Under Review</Badge>;
      case 'Interview':
        return <Badge variant="info">Interview</Badge>;
      case 'Admitted':
        return <Badge variant="success">Admitted</Badge>;
      case 'Rejected':
        return <Badge variant="error">Rejected</Badge>;
    }
  };

  const renderPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid':
        return <Badge variant="success">Paid</Badge>;
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'Past Due':
        return <Badge variant="error">Past Due</Badge>;
      case 'Exempt':
        return <Badge variant="default">Exempt</Badge>;
    }
  };

  return (
    <div className="space-y-5 font-sans" dir={direction}>
      {/* Header Card */}
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Student Admissions CRM</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage applications, review status, and track tuition payments.</p>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg self-start sm:self-auto">
          Total Inquiries: <span className="font-bold text-slate-900">{leads.length}</span>
        </div>
      </Card>

      {/* Filter Toolbar Card */}
      <Card className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 min-w-[220px]">
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs">
            {['ALL', 'New', 'Under Review', 'Interview', 'Admitted'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  statusFilter === status ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Payment Filter */}
          <Select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Payment Statuses' },
              { value: 'Paid', label: 'Tuition: Paid' },
              { value: 'Pending', label: 'Tuition: Pending' },
              { value: 'Past Due', label: 'Tuition: Past Due' },
            ]}
          />
        </div>
      </Card>

      {/* Standardized Data Table */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Student Name</TableHead>
            <TableHead>Course Track</TableHead>
            <TableHead>Tuition Plan</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Workflow</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredLeads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="p-8 text-center text-slate-400">
                No student applications match the selected filter.
              </TableCell>
            </TableRow>
          ) : (
            filteredLeads.map((lead) => (
              <TableRow
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="cursor-pointer"
              >
                <TableCell>
                  <p className="font-bold text-slate-900 text-xs">{lead.studentName || lead.name}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{lead.email} • {lead.phone}</p>
                </TableCell>

                <TableCell className="font-semibold text-slate-800">
                  {lead.courseInterest}
                </TableCell>

                <TableCell>
                  <p className="font-bold text-slate-900 text-xs">{lead.planName || lead.selectedPlanName || 'Foundational'}</p>
                  <p className="text-[11px] text-slate-500 font-mono">${lead.planPrice || lead.tuitionAmount || 65}/mo</p>
                </TableCell>

                <TableCell>{renderPaymentBadge(lead.paymentStatus)}</TableCell>

                <TableCell>{renderStatusBadge(lead.status)}</TableCell>

                <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLead(lead)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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
