import React, { useState, useEffect, useMemo } from 'react';
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
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  PageHeader,
  StatCard,
  TableControls,
  TableSortHeader,
  TablePagination,
  Avatar,
} from '../ui';
import { Users, Clock, UserCheck, CreditCard } from 'lucide-react';

interface LeadsCRMProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

type SortField = 'name' | 'courseInterest' | 'plan' | 'paymentStatus' | 'status';

export const LeadsCRM: React.FC<LeadsCRMProps> = ({ onAddToast }) => {
  const { tenant, direction } = useTenant();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Sorting and Pagination State
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchLeads = async () => {
    const data = await api.getLeads(tenant.id);
    setLeads(data);
  };

  useEffect(() => {
    fetchLeads();
  }, [tenant.id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentFilter, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleUpdateLeadState = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const filteredAndSortedLeads = useMemo(() => {
    let result = leads.filter((lead) => {
      const matchesSearch =
        (lead.studentName || lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm);
      const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
      const matchesPayment = paymentFilter === 'ALL' || lead.paymentStatus === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });

    result.sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      if (sortField === 'name') {
        valA = (a.studentName || a.name || '').toLowerCase();
        valB = (b.studentName || b.name || '').toLowerCase();
      } else if (sortField === 'courseInterest') {
        valA = (a.courseInterest || '').toLowerCase();
        valB = (b.courseInterest || '').toLowerCase();
      } else if (sortField === 'plan') {
        valA = a.planPrice || a.tuitionAmount || 0;
        valB = b.planPrice || b.tuitionAmount || 0;
      } else if (sortField === 'paymentStatus') {
        valA = a.paymentStatus || '';
        valB = b.paymentStatus || '';
      } else if (sortField === 'status') {
        valA = a.status || '';
        valB = b.status || '';
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [leads, searchTerm, statusFilter, paymentFilter, sortField, sortDirection]);

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedLeads.slice(start, start + pageSize);
  }, [filteredAndSortedLeads, currentPage, pageSize]);

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
    <div className="space-y-6 font-sans" dir={direction}>
      {/* Page Header */}
      <PageHeader
        title="Student Admissions CRM"
        subtitle="Manage student inquiries, review admission pipelines, and track tuition payment statuses."
        badge={{ text: `${leads.length} Total Inquiries`, variant: "neutral" }}
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Inquiries"
          value={leads.length.toString()}
          icon={Users}
          trend="All registered inquiries"
        />
        <StatCard
          title="Under Review"
          value={leads.filter((l) => l.status === 'New' || l.status === 'Under Review').length.toString()}
          icon={Clock}
          trend="Awaiting admission review"
        />
        <StatCard
          title="Admitted Students"
          value={leads.filter((l) => l.status === 'Admitted').length.toString()}
          icon={UserCheck}
          trend="Successfully matriculated"
        />
        <StatCard
          title="Tuition Collected"
          value={leads.filter((l) => l.paymentStatus === 'Paid').length.toString()}
          icon={CreditCard}
          trend="Verified fee payments"
        />
      </div>

      {/* Status Tab Navigation */}
      <div className="border-b border-slate-200 flex items-center space-x-1 overflow-x-auto no-scrollbar">
        {['ALL', 'New', 'Under Review', 'Interview', 'Admitted'].map((status) => {
          const isActive = statusFilter === status;
          const count =
            status === 'ALL'
              ? leads.length
              : leads.filter((l) => l.status === status).length;
          return (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`py-3 px-5 font-bold text-xs transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[var(--color-primary,#047857)] text-[var(--color-primary,#047857)] bg-[var(--color-primary-50,#ecfdf5)]'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <span>{status === 'ALL' ? 'All Applicants' : status}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  isActive
                    ? 'bg-[var(--color-primary,#047857)]/15 text-[var(--color-primary,#047857)] font-bold'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Admissions Directory</CardTitle>
            <CardDescription>
              Filter applicant pipelines by admission stage or payment settlement
            </CardDescription>
          </div>
          <TableControls
            searchValue={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            searchPlaceholder="Search by name, email, or phone..."
            actions={
              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 px-4 text-sm bg-white text-slate-800 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] shadow-xs font-semibold"
              >
                <option value="ALL">All Tuition Statuses</option>
                <option value="Paid">Tuition: Paid</option>
                <option value="Pending">Tuition: Pending</option>
                <option value="Past Due">Tuition: Past Due</option>
              </select>
            }
          />
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <TableSortHeader
                    field="name"
                    currentSortField={sortField}
                    currentSortDir={sortDirection}
                    onSort={(f) => handleSort(f as SortField)}
                  >
                    Student Name
                  </TableSortHeader>
                  <TableSortHeader
                    field="courseInterest"
                    currentSortField={sortField}
                    currentSortDir={sortDirection}
                    onSort={(f) => handleSort(f as SortField)}
                  >
                    Course Track
                  </TableSortHeader>
                  <TableSortHeader
                    field="plan"
                    currentSortField={sortField}
                    currentSortDir={sortDirection}
                    onSort={(f) => handleSort(f as SortField)}
                  >
                    Tuition Plan
                  </TableSortHeader>
                  <TableSortHeader
                    field="paymentStatus"
                    currentSortField={sortField}
                    currentSortDir={sortDirection}
                    onSort={(f) => handleSort(f as SortField)}
                  >
                    Payment
                  </TableSortHeader>
                  <TableSortHeader
                    field="status"
                    currentSortField={sortField}
                    currentSortDir={sortDirection}
                    onSort={(f) => handleSort(f as SortField)}
                  >
                    Workflow
                  </TableSortHeader>
                  <th className="py-3.5 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredAndSortedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-slate-400">
                      <Avatar size="xl" className="mx-auto mb-3" />
                      <p className="font-bold text-base text-slate-800">No applications match criteria</p>
                      <p className="text-sm text-slate-500 mt-1">Adjust your search query or status filter.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-5 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <Avatar name={lead.studentName || lead.name} size="md" />
                          <div>
                            <span className="block font-bold text-slate-900">{lead.studentName || lead.name}</span>
                            <span className="text-xs text-slate-500 font-normal block">
                              {lead.email} {lead.phone ? `• ${lead.phone}` : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 font-semibold text-slate-800">
                        {lead.courseInterest}
                      </td>

                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-900 block">
                          {lead.planName || lead.selectedPlanName || 'Foundational'}
                        </span>
                        <span className="text-xs text-slate-500 font-normal block">
                          ${lead.planPrice || lead.tuitionAmount || 65}/mo
                        </span>
                      </td>

                      <td className="py-4 px-5">{renderPaymentBadge(lead.paymentStatus)}</td>

                      <td className="py-4 px-5">{renderStatusBadge(lead.status)}</td>

                      <td className="py-4 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedLead(lead)}
                          className="font-bold text-xs"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalCount={filteredAndSortedLeads.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </CardContent>
      </Card>

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
