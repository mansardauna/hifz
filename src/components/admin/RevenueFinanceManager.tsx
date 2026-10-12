import React, { useState, useEffect, useMemo } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useToast } from '../../context/ToastContext';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Input,
  Modal,
  PageHeader,
  StatCard,
  TableControls,
  TableSortHeader,
  TablePagination,
} from '../ui';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PlusCircle,
  Receipt,
  Download,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface FinancialTransaction {
  id: string;
  type: 'Income' | 'Expense';
  amount: number;
  currency: string;
  category: string;
  description: string;
  party: string;
  gateway: string;
  status: string;
  date: string;
  createdAt: string;
}

export const RevenueFinanceManager: React.FC = () => {
  const { tenant, direction } = useTenant();
  const { addToast } = useToast();

  const [activeStreamTab, setActiveStreamTab] = useState<'all' | 'income' | 'expense'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netMargin: 0,
    pendingTuition: 0,
    transactionCount: 0,
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);

  // Filtering & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Record Transaction Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form, setForm] = useState({
    type: 'Income' as 'Income' | 'Expense',
    category: 'Tuition Payment',
    amount: '',
    description: '',
    party: '',
    gateway: 'Stripe',
    status: 'Completed',
    date: new Date().toISOString().split('T')[0],
  });

  const fetchFinancials = async () => {
    setIsLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('ankabit_auth_token') : null;
      const res = await fetch(`/api/tenant/finance?tenantId=${tenant.id || tenant.subdomain}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary || {});
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.warn('Failed to fetch finance records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancials();
  }, [tenant.id, tenant.subdomain]);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || isNaN(Number(form.amount))) {
      addToast({ type: 'error', title: 'Invalid Amount', message: 'Please provide a valid dollar amount.' });
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('ankabit_auth_token') : null;
      const res = await fetch('/api/tenant/finance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          type: form.type,
          category: form.category,
          amount: Number(form.amount),
          description: form.description,
          party: form.party,
          gateway: form.gateway,
          status: form.status,
          date: form.date,
          tenantId: tenant.id || tenant.subdomain,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to record transaction');
      }

      addToast({
        type: 'success',
        title: 'Transaction Recorded',
        message: `${form.type} of $${form.amount} successfully added to ledger.`,
      });

      setIsAddModalOpen(false);
      setForm({
        type: 'Income',
        category: 'Tuition Payment',
        amount: '',
        description: '',
        party: '',
        gateway: 'Stripe',
        status: 'Completed',
        date: new Date().toISOString().split('T')[0],
      });
      fetchFinancials();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: err.message });
    }
  };

  // Filtered & Sorted Transactions
  const filteredAndSortedTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        const matchesType =
          activeStreamTab === 'all' ||
          tx.type.toLowerCase() === activeStreamTab.toLowerCase();
        const matchesCategory =
          categoryFilter === 'ALL' ||
          tx.category.toLowerCase().includes(categoryFilter.toLowerCase());
        const matchesSearch =
          tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const fieldA = (a as any)[sortField] || '';
        const fieldB = (b as any)[sortField] || '';
        if (sortDir === 'asc') return fieldA > fieldB ? 1 : -1;
        return fieldA < fieldB ? 1 : -1;
      });
  }, [transactions, activeStreamTab, categoryFilter, searchTerm, sortField, sortDir]);

  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  return (
    <div className="space-y-6 font-sans" dir={direction}>
      {/* Page Header matching PFMS */}
      <PageHeader
        title="Academy Financial Ledger & Revenue"
        subtitle="Real-time tuition income, operational overhead expenses, payroll disbursements, and net cash flow."
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Record Transaction
          </Button>
        }
      />

      {/* Main KPI Cards Grid matching PFMS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Gross Income"
          value={`$${summary.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtext="Tuition and registration revenue"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Total Expenses"
          value={`$${summary.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtext="Faculty salaries, SFU, and hosting"
          icon={TrendingDown}
          color="rose"
        />
        <StatCard
          title="Net Operating Profit"
          value={`$${summary.netMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtext={`Margin: ${summary.totalIncome > 0 ? `${Math.round((summary.netMargin / summary.totalIncome) * 100)}%` : '0%'}`}
          icon={Wallet}
          color={summary.netMargin >= 0 ? 'emerald' : 'rose'}
        />
        <StatCard
          title="Pending Receivables"
          value={`$${summary.pendingTuition.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtext="Unpaid / pending student tuition"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Stream Tabs with standard PFMS border-b-2 styling */}
      <div className="border-b border-slate-200 flex items-center space-x-1 overflow-x-auto">
        <Button
          variant="tab"
          isActive={activeStreamTab === 'all'}
          onClick={() => {
            setActiveStreamTab('all');
            setCurrentPage(1);
          }}
        >
          <span>All Financial Records</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              activeStreamTab === 'all'
                ? 'bg-[var(--color-primary,#047857)]/15 text-[var(--color-primary,#047857)]'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {transactions.length}
          </span>
        </Button>

        <Button
          variant="tab"
          isActive={activeStreamTab === 'income'}
          onClick={() => {
            setActiveStreamTab('income');
            setCurrentPage(1);
          }}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Income Stream</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              activeStreamTab === 'income'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {transactions.filter((t) => t.type === 'Income').length}
          </span>
        </Button>

        <Button
          variant="tab"
          isActive={activeStreamTab === 'expense'}
          onClick={() => {
            setActiveStreamTab('expense');
            setCurrentPage(1);
          }}
        >
          <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
          <span>Expense Stream</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              activeStreamTab === 'expense'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {transactions.filter((t) => t.type === 'Expense').length}
          </span>
        </Button>
      </div>

      {/* Financial Records Card with TableControls, Sort Headers, and TablePagination */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Transactions Ledger</CardTitle>
          <span className="text-xs text-slate-500 font-medium">
            {filteredAndSortedTransactions.length} records found
          </span>
        </CardHeader>

        <TableControls
          searchTerm={searchTerm}
          setSearchTerm={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
          placeholder="Search by description, reference, or counterparty..."
          actions={
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-semibold bg-white text-slate-700 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 cursor-pointer shadow-sm transition-all"
            >
              <option value="ALL">All Categories</option>
              <option value="Tuition">Tuition Payments</option>
              <option value="Salary">Faculty Salaries</option>
              <option value="Hosting">Hosting & WebRTC SFU</option>
              <option value="Facility">Facility & Books</option>
              <option value="Marketing">Marketing & Ads</option>
            </select>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <TableSortHeader
                  label="Date"
                  sortKey="date"
                  currentSort={{ key: sortField, dir: sortDir }}
                  onSort={handleSort}
                />
                <TableSortHeader
                  label="Description / Reference"
                  sortKey="description"
                  currentSort={{ key: sortField, dir: sortDir }}
                  onSort={handleSort}
                />
                <TableSortHeader
                  label="Stream & Category"
                  sortKey="type"
                  currentSort={{ key: sortField, dir: sortDir }}
                  onSort={handleSort}
                />
                <TableSortHeader
                  label="Counterparty"
                  sortKey="party"
                  currentSort={{ key: sortField, dir: sortDir }}
                  onSort={handleSort}
                />
                <th className="px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Method</th>
                <TableSortHeader
                  label="Amount ($)"
                  sortKey="amount"
                  currentSort={{ key: sortField, dir: sortDir }}
                  onSort={handleSort}
                  align="right"
                />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">No transactions found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Click "Record Transaction" to register income or expenses.</p>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <span>{tx.description}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant={tx.type === 'Income' ? 'success' : 'error'}
                          className="text-[10px] font-bold uppercase tracking-wider"
                        >
                          {tx.type}
                        </Badge>
                        <span className="text-slate-600 font-medium text-[11px] capitalize">{tx.category}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {tx.party}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] uppercase">
                        {tx.gateway}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-xs sm:text-sm">
                      <span
                        className={
                          tx.type === 'Income' ? 'text-emerald-700 font-black' : 'text-rose-600 font-black'
                        }
                      >
                        {tx.type === 'Income' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalItems={filteredAndSortedTransactions.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </Card>

      {/* RECORD TRANSACTION MODAL */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Record Financial Transaction"
        >
          <form onSubmit={handleCreateTransaction} className="space-y-4 font-sans text-xs">
            {/* Stream Type: Income vs Expense Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    type: 'Income',
                    category: 'Tuition Payment',
                  })
                }
                className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  form.type === 'Income'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                + Income (Tuition / Fee)
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    type: 'Expense',
                    category: 'Faculty Salary',
                  })
                }
                className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  form.type === 'Expense'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                - Expense (Overhead / Salary)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-hidden"
                >
                  {form.type === 'Income' ? (
                    <>
                      <option value="Tuition Payment">Tuition Payment</option>
                      <option value="Registration Fee">Registration Fee</option>
                      <option value="Sanad Exam Fee">Sanad Exam Fee</option>
                      <option value="Donation / Grant">Donation / Grant</option>
                    </>
                  ) : (
                    <>
                      <option value="Faculty Salary">Faculty / Teacher Salary</option>
                      <option value="Server & WebRTC SFU">Server & WebRTC SFU</option>
                      <option value="Facilities & Books">Facilities & Physical Books</option>
                      <option value="Software & Stripe Fees">Software & Payment Fees</option>
                      <option value="Marketing & Outreach">Marketing & Outreach</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Amount ($ USD) *</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 150.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Description / Memo</label>
              <Input
                placeholder="e.g. Monthly tuition payment or August faculty disbursement"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  {form.type === 'Income' ? 'Payer (Student / Parent)' : 'Payee (Vendor / Teacher)'}
                </label>
                <Input
                  placeholder="e.g. Maryam Al-Khatib or Ustadhah Zainab"
                  value={form.party}
                  onChange={(e) => setForm({ ...form, party: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Payment Method</label>
                <select
                  value={form.gateway}
                  onChange={(e) => setForm({ ...form, gateway: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-hidden"
                >
                  <option value="Stripe">Stripe (Card / Apple Pay)</option>
                  <option value="Moyasar">Moyasar (Mada / STC Pay)</option>
                  <option value="Bank Transfer">Bank Wire / ACH</option>
                  <option value="Cash">Cash Receipt</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Transaction Date</label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={form.type === 'Income' ? 'primary' : 'danger'}
                type="submit"
                className="font-bold"
              >
                Record {form.type} Entry
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
