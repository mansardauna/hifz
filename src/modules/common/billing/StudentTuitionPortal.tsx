import React from 'react';
import { useTenant } from '../../../context/TenantContext';
import { ToastMessage } from '../../../components/ui/Toast';
import { Button, Card, Badge } from '../../../components/ui';
import { CreditCard, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

interface StudentTuitionPortalProps {
  onAddToast?: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const StudentTuitionPortal: React.FC<StudentTuitionPortalProps> = ({ onAddToast }) => {
  const { tenant } = useTenant();
  const isSchoolNiche =
    tenant.niche === 'school' ||
    tenant.subdomain.includes('school') ||
    tenant.subdomain.includes('oxford') ||
    tenant.subdomain.includes('horizon');
  const isCodingNiche =
    tenant.niche === 'coding' ||
    tenant.niche === 'code_academy' ||
    tenant.subdomain.includes('code');

  const handleDownloadReceipt = (invoiceNumber: string) => {
    if (onAddToast) {
      onAddToast({
        type: 'success',
        title: 'Receipt Downloaded',
        message: `Official invoice receipt ${invoiceNumber} downloaded successfully.`
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="p-4 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              {isSchoolNiche
                ? 'Academic Tuition & Fee Statements'
                : isCodingNiche
                ? 'Bootcamp Tuition & Subscriptions'
                : 'Enrolled Tuition Invoices'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              View, verify and download official encrypted payment receipts issued by {tenant.name}.
            </p>
          </div>
          <Badge variant="success" className="gap-1 self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5" /> Account Current - Paid in Full
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors">
            <div>
              <span className="font-bold text-slate-800 block sm:inline">
                {isSchoolNiche
                  ? 'Term 1 Comprehensive Academic Tuition & Lab Fees'
                  : isCodingNiche
                  ? 'Full-Stack Software Engineering Immersion Track'
                  : 'Spring Semester Term Tuition'}
              </span>
              <span className="text-slate-500 sm:ml-2 font-mono">#INV-2026-089</span>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="font-bold font-mono text-emerald-700">
                {isSchoolNiche ? '$1,450.00 Paid' : isCodingNiche ? '$2,400.00 Paid' : '$65.00 Paid'}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownloadReceipt('#INV-2026-089')}
                className="gap-1 text-xs"
              >
                <Download className="w-3.5 h-3.5" /> PDF Receipt
              </Button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors">
            <div>
              <span className="font-bold text-slate-800 block sm:inline">
                {isSchoolNiche
                  ? 'AP & Laboratory Science Materials Surcharge'
                  : isCodingNiche
                  ? 'Cloud Sandbox Infrastructure & GPU Quota'
                  : 'Tajweed Rules Masterclass Registration'}
              </span>
              <span className="text-slate-500 sm:ml-2 font-mono">#INV-2026-042</span>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="font-bold font-mono text-emerald-700">
                {isSchoolNiche ? '$180.00 Paid' : isCodingNiche ? '$90.00 Paid' : '$35.00 Paid'}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownloadReceipt('#INV-2026-042')}
                className="gap-1 text-xs"
              >
                <Download className="w-3.5 h-3.5" /> PDF Receipt
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
