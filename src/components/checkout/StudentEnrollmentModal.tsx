import React, { useState } from 'react';
import { PricingPlan, Lead } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { api } from '../../services/api';
import {
  X,
  CheckCircle2,
  Lock,
  CreditCard,
  Building,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StudentEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: PricingPlan | null;
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const StudentEnrollmentModal: React.FC<StudentEnrollmentModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  onAddToast,
}) => {
  const router = useRouter();
  const { tenant } = useTenant();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [activePlan, setActivePlan] = useState<PricingPlan>(
    selectedPlan || tenant.pricingPlans[0] || {
      id: 'plan-default',
      name: 'Intensive Hifz Program',
      nameAr: 'برنامج الحفظ المكثف',
      description: '4 live 1-on-1 sessions weekly with Sanad Qari',
      descriptionAr: '',
      priceMonthly: 140,
      priceYearly: 1400,
      currency: 'USD',
      features: ['4 Live Sessions Weekly', 'Audio Homework Grading', 'Sanad Ijazah Prep'],
    }
  );

  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'United States',
    priorHifz: '1 - 5 Juz',
    parentName: '',
    paymentMethod: 'stripe' as 'stripe' | 'moyasar' | 'bank_transfer',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '•••',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmitEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Create student enrolled lead record
      const newStudent: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
        name: studentData.name,
        studentName: studentData.name,
        email: studentData.email,
        phone: studentData.phone,
        country: studentData.country,
        courseInterest: activePlan.name,
        preferredSchedule: 'Evening (Isha-Night)',
        priorHifzLevel: studentData.priorHifz,
        status: 'Admitted',
        paymentStatus: 'Paid',
        selectedPlanId: activePlan.id,
        selectedPlanName: activePlan.name,
        tuitionAmount: activePlan.priceMonthly,
        notes: `Enrolled via Tenant SaaS Checkout (${studentData.paymentMethod.toUpperCase()}).`,
        invoices: [
          {
            id: `inv-${Date.now()}`,
            planName: activePlan.name,
            amount: activePlan.priceMonthly,
            currency: activePlan.currency,
            status: 'Paid',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            paidAt: new Date().toISOString(),
            gateway: studentData.paymentMethod === 'moyasar' ? 'moyasar' : studentData.paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'stripe',
            transactionId: `tx_${Math.random().toString(36).substring(2, 9)}`,
          },
        ],
      };

      await api.createLead(newStudent);
      setIsProcessing(false);
      setStep(4);

      onAddToast({
        type: 'success',
        title: 'Enrollment Complete!',
        message: `Welcome to ${tenant.name}! Your student account has been created.`,
      });
    } catch (err) {
      setIsProcessing(false);
      onAddToast({
        type: 'error',
        title: 'Enrollment Error',
        message: 'Could not process enrollment. Please try again.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-md border border-slate-200 shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900">
        {/* Modal Top Bar */}
        <div className="bg-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-emerald-900 text-amber-300 flex items-center justify-center font-bold">
              {tenant.faviconUrl || '📖'}
            </div>
            <div>
              <h3 className="font-bold font-display text-sm text-white">
                {tenant.name} • Student Enrollment
              </h3>
              <p className="text-[10px] text-emerald-300">
                Official Academy SaaS Registration & Tuition Checkout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-[11px] font-bold font-display uppercase tracking-wider text-slate-500">
          <span className={step >= 1 ? 'text-emerald-700 font-extrabold' : ''}>1. Student Info</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-emerald-700 font-extrabold' : ''}>2. Plan Selection</span>
          <span>→</span>
          <span className={step >= 3 ? 'text-emerald-700 font-extrabold' : ''}>3. Payment</span>
          <span>→</span>
          <span className={step === 4 ? 'text-emerald-700 font-extrabold' : ''}>4. Access LMS</span>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={studentData.name}
                  onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                  placeholder="e.g. Zayd Al-Mansoor"
                  className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student / Parent Email *</label>
                  <input
                    type="email"
                    required
                    value={studentData.email}
                    onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    value={studentData.phone}
                    onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                    placeholder="+966 50 123 4567"
                    className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Memorization Level</label>
                  <select
                    value={studentData.priorHifz}
                    onChange={(e) => setStudentData({ ...studentData, priorHifz: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-emerald-500"
                  >
                    <option>0 (Beginner / Qaida)</option>
                    <option>1 - 5 Juz</option>
                    <option>6 - 15 Juz</option>
                    <option>16 - 29 Juz</option>
                    <option>Complete Quran (30 Juz)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={studentData.parentName}
                    onChange={(e) => setStudentData({ ...studentData, parentName: e.target.value })}
                    placeholder="e.g. Abu Zayd"
                    className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={!studentData.name || !studentData.email || !studentData.phone}
                onClick={() => setStep(2)}
                className="w-full py-3 mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold font-display text-xs rounded-md shadow-md transition-colors uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Tuition Plans</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 font-medium">Select your tuition subscription plan:</p>

              <div className="space-y-3">
                {tenant.pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setActivePlan(plan)}
                    className={`p-4 rounded-md border transition-all cursor-pointer flex items-center justify-between ${
                      activePlan.id === plan.id
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-display text-slate-900 text-sm">{plan.name}</span>
                        {plan.popular && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px]">{plan.description}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold font-mono text-emerald-800">
                        ${plan.priceMonthly}
                        <span className="text-[10px] text-slate-500 font-sans">/mo</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 border border-slate-300 text-slate-700 font-bold rounded-md text-xs cursor-pointer hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-display text-xs rounded-md shadow-md transition-colors uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Payment (${activePlan.priceMonthly}/mo)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmitEnrollment} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Selected Plan</span>
                  <p className="font-bold font-display text-slate-900">{activePlan.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Tuition</span>
                  <p className="font-mono font-bold text-emerald-700 text-base">${activePlan.priceMonthly} USD</p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStudentData({ ...studentData, paymentMethod: 'stripe' })}
                    className={`p-2.5 rounded-md border text-center font-bold text-[11px] flex flex-col items-center gap-1 ${
                      studentData.paymentMethod === 'stripe'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentData({ ...studentData, paymentMethod: 'moyasar' })}
                    className={`p-2.5 rounded-md border text-center font-bold text-[11px] flex flex-col items-center gap-1 ${
                      studentData.paymentMethod === 'moyasar'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Mada / Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentData({ ...studentData, paymentMethod: 'bank_transfer' })}
                    className={`p-2.5 rounded-md border text-center font-bold text-[11px] flex flex-col items-center gap-1 ${
                      studentData.paymentMethod === 'bank_transfer'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-4 h-4 text-slate-600" />
                    <span>Bank Wire</span>
                  </button>
                </div>
              </div>

              {studentData.paymentMethod === 'stripe' && (
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-md border border-slate-200">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={studentData.cardNumber}
                      onChange={(e) => setStudentData({ ...studentData, cardNumber: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-md font-mono bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Expires</label>
                      <input
                        type="text"
                        value={studentData.cardExp}
                        onChange={(e) => setStudentData({ ...studentData, cardExp: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-md font-mono bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        value={studentData.cardCvc}
                        onChange={(e) => setStudentData({ ...studentData, cardCvc: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-md font-mono bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {studentData.paymentMethod === 'moyasar' && (
                <div className="p-3.5 bg-amber-50 rounded-md border border-amber-200 text-[11px] text-amber-900 space-y-1">
                  <p className="font-bold">🇸🇦 Moyasar Gateway (Saudi Arabia & GCC)</p>
                  <p>Supports Mada debit cards, Apple Pay, and STC Pay directly to the academy merchant IBAN.</p>
                </div>
              )}

              {studentData.paymentMethod === 'bank_transfer' && (
                <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200 text-[11px] text-slate-700 space-y-1">
                  <p className="font-bold">Direct Academy Wire Transfer</p>
                  <p>Bank: Al-Rajhi Bank • IBAN: SA0380000000608010167519</p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 border border-slate-300 text-slate-700 font-bold rounded-md text-xs cursor-pointer hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold font-display text-xs rounded-md shadow-md transition-colors uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Processing Payment...' : `Complete Enrollment • $${activePlan.priceMonthly}`}</span>
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold font-display text-slate-900">
                Enrollment & Tuition Confirmed!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Barakallahu Feekum. You are officially enrolled in the <strong>{activePlan.name}</strong> at <strong>{tenant.name}</strong>.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/${tenant.subdomain}/lms`);
                  }}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-display text-xs rounded-md shadow-md transition-colors uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Launch Student LMS Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
