import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  BookOpen,
  Calendar,
  User,
  ExternalLink,
  Search,
  Building2,
  Check,
} from 'lucide-react';
import { Badge, Button, Card } from '../ui';

interface CertificateVerifierProps {
  certificateId?: string;
}

export const CertificateVerifier: React.FC<CertificateVerifierProps> = ({ certificateId = 'IJZ-784920' }) => {
  const { tenant } = useTenant();
  const [searchId, setSearchId] = useState(certificateId);
  const [isVerified] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Top Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-700/20">
            <Award className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Official Sanad & Ijazah Verification Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Authenticity and continuous chain of narration registry for {tenant.name || 'Hifz Islamic Academy'}.
          </p>
        </div>

        {/* Verification Status Card */}
        {isVerified && (
          <div className="bg-white rounded-3xl border border-emerald-500/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Top Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span className="font-extrabold text-sm text-slate-900">Certificate Status: Verified Authentic</span>
              </div>
              <Badge variant="success" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                ACTIVE SANAD RECORD
              </Badge>
            </div>

            {/* Certificate Details */}
            <div className="py-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Recipient / Reciter
                  </span>
                  <div className="text-sm font-black text-slate-900">Zayd Ibn Harithah</div>
                  <div className="text-xs font-arabic text-slate-700 font-bold">زيد بن حارثة</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Certificate Serial ID
                  </span>
                  <div className="text-sm font-mono font-black text-emerald-700">{searchId}</div>
                  <div className="text-[10px] text-slate-400">Cryptographically Signed Hash</div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span>Certification Track:</span>
                  <span className="text-emerald-800">Ijazah in Recitation & Tajweed</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span>Riwayah / Transmission:</span>
                  <span className="text-emerald-800">Hafs 'an 'Asim via Shatibiyyah</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span>Grade / Distinction:</span>
                  <span className="text-emerald-800">Mumtaz (Distinction / 98%)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span>Supervising Sheikh:</span>
                  <span className="text-emerald-800">Sheikh Tariq Al-Mansoor</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span>Completion Date:</span>
                  <span className="text-emerald-800">September 4, 2026 (22 Safar 1448 AH)</span>
                </div>
              </div>

              {/* Sanad Chain Summary */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-arabic text-slate-700 leading-relaxed text-center">
                إسناد متصل إلى رسول الله ﷺ عن جبريل عليه السلام عن رب العزة جل جلاله
              </div>
            </div>

            {/* Issuing Institution Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Issued by: <strong>{tenant.name || 'Hifz Academy'}</strong></span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold">Encrypted Public Ledger</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
