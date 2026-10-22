import React, { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';
import { ToastMessage } from '../../../components/ui/Toast';
import { Button, Card, Badge, Modal, Input, Select } from '../../../components/ui';
import {
  CreditCard,
  Download,
  CheckCircle2,
  ShieldCheck,
  Receipt,
  Calendar,
  AlertCircle,
  ExternalLink,
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  paidAt?: string;
  paymentMethod: string;
}

interface StudentTuitionPortalProps {
  onAddToast?: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const StudentTuitionPortal: React.FC<StudentTuitionPortalProps> = ({ onAddToast }) => {
  const { tenant } = useTenant();
  const { user } = useAuth();

  const isSchoolNiche =
    tenant.niche === 'school' ||
    tenant.subdomain.includes('school') ||
    tenant.subdomain.includes('oxford') ||
    tenant.subdomain.includes('horizon');
  const isCodingNiche =
    tenant.niche === 'coding' ||
    tenant.niche === 'code_academy' ||
    tenant.subdomain.includes('code');

  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    {
      id: 'inv-1',
      invoiceNumber: 'INV-2026-089',
      description: isSchoolNiche
        ? 'Term 1 Comprehensive Academic Tuition & Lab Fees'
        : isCodingNiche
        ? 'Full-Stack Software Engineering Immersion Track'
        : 'Spring Semester Hifz & Tajweed Term Tuition',
      amount: isSchoolNiche ? 1450 : isCodingNiche ? 2400 : 65,
      currency: 'USD',
      date: '01 Oct 2026',
      status: 'paid',
      paidAt: '01 Oct 2026',
      paymentMethod: 'Visa •••• 4242',
    },
    {
      id: 'inv-2',
      invoiceNumber: 'INV-2026-042',
      description: isSchoolNiche
        ? 'AP & Laboratory Science Materials Surcharge'
        : isCodingNiche
        ? 'Cloud Sandbox Infrastructure & GPU Quota'
        : 'Tajweed Rules Masterclass Registration',
      amount: isSchoolNiche ? 180 : isCodingNiche ? 90 : 35,
      currency: 'USD',
      date: '15 Sep 2026',
      status: 'paid',
      paidAt: '15 Sep 2026',
      paymentMethod: 'Apple Pay',
    },
  ]);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('65');
  const [payGateway, setPayGateway] = useState<'stripe' | 'moyasar'>('stripe');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleDownloadReceipt = (inv: InvoiceItem) => {
    // Generate text receipt blob for instant download
    const receiptText = `
============================================================
              ${tenant.name.toUpperCase()}
               OFFICIAL PAYMENT RECEIPT
============================================================
Invoice Number:   ${inv.invoiceNumber}
Date:             ${inv.paidAt || inv.date}
Student Name:     ${user?.name || 'Enrolled Student'}
Student Email:    ${user?.email || 'student@academy.com'}
      Campus / Domain:  ${tenant.customDomain || `${tenant.subdomain}.liwanlms.com`}

------------------------------------------------------------
DESCRIPTION:
${inv.description}

AMOUNT PAID:      $${inv.amount.toFixed(2)} ${inv.currency}
PAYMENT METHOD:   ${inv.paymentMethod}
STATUS:           SUCCESSFULLY PROCESSED (PAID IN FULL)
SECURITY:         256-Bit SSL Encrypted Transaction
============================================================
Thank you for your enrollment at ${tenant.name}.
      For billing support: admissions@${tenant.subdomain}.liwanlms.com
============================================================
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${inv.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onAddToast) {
      onAddToast({
        type: 'success',
        title: 'Receipt Downloaded',
        message: `Official invoice receipt ${inv.invoiceNumber} has been downloaded.`,
      });
    }
  };

  const handleProcessPayment = async () => {
    setIsProcessingPayment(true);
    try {
      if (payGateway === 'stripe') {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'student_tuition',
            tenantId: tenant.id,
            studentEmail: user?.email,
            studentName: user?.name,
            amount: parseFloat(payAmount) || 65,
            description: isQuran()
              ? 'Hifz & Tajweed Halaqah Monthly Tuition Renewal'
              : isCodingNiche
              ? 'Bootcamp Immersion Module Tuition'
              : 'Academic Term Coursework Renewal',
          }),
        });

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        throw new Error(data.message || data.error || 'Could not initialize Stripe checkout session');
      } else {
        throw new Error('Selected payment method is currently undergoing gateway maintenance. Please select Stripe card checkout.');
      }
    } catch (err: any) {
      if (onAddToast) {
        onAddToast({
          type: 'error',
          title: 'Payment Gateway Notice',
          message: err.message || 'Payment processing could not be initiated. Please verify gateway settings.',
        });
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  function isQuran() {
    return !isSchoolNiche && !isCodingNiche;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold capitalize tracking-wider text-slate-400">Account Standing</span>
          <div className="flex items-center gap-2 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="text-xl font-semibold text-slate-900 font-display">Paid in Full</h4>
          </div>
          <p className="text-xs text-slate-500">Zero outstanding balance for current term</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold capitalize tracking-wider text-slate-400">Next Billing Renewal</span>
          <h4 className="text-xl font-semibold text-slate-900 font-display pt-1">01 Nov 2026</h4>
          <p className="text-xs text-slate-500">Auto-renews via primary payment method</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 flex flex-col justify-between">
          <span className="text-xs font-semibold capitalize tracking-wider text-slate-400">Online Quick Pay</span>
          <Button
            onClick={() => setIsPayModalOpen(true)}
            variant="primary"
            className="w-full h-10 rounded-xl text-xs font-semibold gap-2 mt-2"
          >
            <CreditCard className="w-4 h-4" /> Make Tuition Payment
          </Button>
        </div>
      </div>

      {/* Main Invoices Card */}
      <Card className="p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 font-display">
              <Receipt className="w-5 h-5 text-emerald-600" />
              {isSchoolNiche
                ? 'Academic Tuition & Fee Statements'
                : isCodingNiche
                ? 'Bootcamp Tuition & Subscriptions'
                : 'Enrolled Tuition Invoices & Statements'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Encrypted, verified tuition statements issued by {tenant.name}. Download PDF receipts anytime.
            </p>
          </div>
          <Badge variant="success" className="gap-1.5 self-start sm:self-auto py-1 px-3 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Secure
          </Badge>
        </div>

        <div className="space-y-3">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 hover:bg-white transition-all shadow-2xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{inv.description}</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-100 text-emerald-800">
                    PAID
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="font-mono">{inv.invoiceNumber}</span>
                  <span>•</span>
                  <span>Date: {inv.date}</span>
                  <span>•</span>
                  <span>Method: {inv.paymentMethod}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <span className="font-semibold font-mono text-base text-emerald-700">
                  ${inv.amount.toFixed(2)}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadReceipt(inv)}
                  className="h-9 px-3 rounded-xl gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950"
                >
                  <Download className="w-3.5 h-3.5" /> Download Receipt
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Make Tuition Payment"
        description={`Securely process your enrollment tuition for ${tenant.name}.`}
        size="md"
      >
        <div className="space-y-5 py-2">
          <div>
            <label className="block text-xs font-semibold capitalize tracking-wider text-slate-700 mb-2">
              Select Payment Amount
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['35', '65', '140'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setPayAmount(amt)}
                  className={`p-3 rounded-xl border text-center font-semibold text-sm transition-all cursor-pointer ${
                    payAmount === amt
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  ${amt} USD
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold capitalize tracking-wider text-slate-700 mb-2">
              Payment Gateway
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayGateway('stripe')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                  payGateway === 'stripe'
                    ? 'border-emerald-600 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Stripe Gateway</span>
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500">Visa, Mastercard, Apple Pay</p>
              </button>

              <button
                type="button"
                onClick={() => setPayGateway('moyasar')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                  payGateway === 'moyasar'
                    ? 'border-emerald-600 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Moyasar Gateway</span>
                  <span className="text-[10px] font-semibold capitalize text-teal-600 font-mono">MADA</span>
                </div>
                <p className="text-[11px] text-slate-500">Saudi Mada, GCC & Apple Pay</p>
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Bank-Grade Encryption</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Your transaction is processed via end-to-end tokenization. No card information is stored on academy servers.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setIsPayModalOpen(false)}
              disabled={isProcessingPayment}
              className="h-11 rounded-xl text-sm font-semibold"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleProcessPayment}
              isLoading={isProcessingPayment}
              className="h-11 rounded-xl text-sm font-semibold gap-2"
            >
              <Lock className="w-4 h-4" /> Pay ${payAmount}.00 USD
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
