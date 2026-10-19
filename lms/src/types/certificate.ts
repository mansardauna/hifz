export type CertificateTheme = 'royal_gold' | 'emerald_medina' | 'navy_sanad' | 'obsidian_khatam';

export interface SanadCertificate {
  id: string;
  certificateNumber: string;
  studentNameEn: string;
  studentNameAr: string;
  riwayah: string;
  riwayahAr: string;
  trackType: 'hifz_full' | 'tajweed_ijazah' | 'qirat_asharah' | 'nazirah';
  grade: 'Mumtaz (Distinction)' | 'Jayyid Jiddan (Very Good)' | 'Jayyid (Good)';
  completionDate: string;
  hijriDate: string;
  sheikhName: string;
  sheikhTitle: string;
  sanadChainSummary: string;
  theme: CertificateTheme;
  showWaxSeal: boolean;
  showKhatamBorder: boolean;
  qrVerificationUrl: string;
  issuedAt: string;
}
