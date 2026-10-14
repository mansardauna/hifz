import React, { useState } from 'react';
import { PricingPlan, Lead } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { useNotifications } from '../../context/NotificationContext';
import { detectTenantNicheType } from '../../services/classroomCustomizationService';
import { ToastMessage } from '../ui/Toast';
import { api } from '../../services/api';
import { Modal, Button, Input, Select, Card, Badge } from '../ui';
import {
  CreditCard,
  Building,
  User,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  Lock,
  AlertTriangle
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
  const niche = detectTenantNicheType(tenant);
  const isQuran = niche === 'quran';
  const { triggerEventNotification } = useNotifications();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [activePlan, setActivePlan] = useState<PricingPlan>(
    selectedPlan || tenant.pricingPlans[0] || {
      id: 'plan-default',
      name: 'Intensive Track',
      nameAr: 'المسار المكثف',
      description: '4 live sessions weekly with dedicated instructor',
      descriptionAr: '',
      priceMonthly: 140,
      priceYearly: 1400,
      currency: 'USD',
      features: ['4 Live Sessions Weekly', 'Audio Feedback', 'Certificate'],
    }
  );

  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'United States',
    priorLevel: 'Beginner',
    parentName: '',
    paymentMethod: 'stripe' as 'stripe' | 'moyasar' | 'bank_transfer',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '•••',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Check connection status for each payment method
  const stripeConfig = tenant.paymentGateways?.find((g) => g.provider === 'stripe');
  const moyasarConfig = tenant.paymentGateways?.find((g) => g.provider === 'moyasar');
  const bankConfig = tenant.paymentGateways?.find((g) => g.provider === 'bank_transfer');

  const isStripeConnected = Boolean(
    stripeConfig?.enabled && (stripeConfig?.publishableKey || tenant.settings?.integrations?.stripe?.publishableKey)
  );
  const isMoyasarConnected = Boolean(
    moyasarConfig?.enabled && (moyasarConfig?.publishableKey || tenant.settings?.integrations?.moyasar?.publishableKey)
  );
  const isBankConnected = Boolean(
    bankConfig?.enabled && (bankConfig?.bankDetails?.iban || bankConfig?.bankDetails?.accountName)
  );

  const isCurrentMethodConnected =
    studentData.paymentMethod === 'stripe'
      ? isStripeConnected
      : studentData.paymentMethod === 'moyasar'
      ? isMoyasarConnected
      : isBankConnected;

  const handleSubmitEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCurrentMethodConnected) {
      const methodName =
        studentData.paymentMethod === 'stripe'
          ? 'Stripe'
          : studentData.paymentMethod === 'moyasar'
          ? 'Moyasar'
          : 'Bank Wire';
      onAddToast({
        type: 'error',
        title: `${methodName} Not Connected`,
        message: `API keys for ${methodName} are not configured for this academy. Please configure them in Settings > Payment Gateways or select another payment option.`,
      });
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Submit applicant registration with authentic Pending status
      const newStudentPayload = {
        name: studentData.name,
        studentName: studentData.name,
        email: studentData.email,
        phone: studentData.phone,
        country: studentData.country,
        courseInterest: activePlan.name,
        preferredSchedule: 'Evening Track',
        priorHifzLevel: studentData.priorLevel,
        status: 'New' as const,
        paymentStatus: 'Pending' as const,
        selectedPlanId: activePlan.id,
        selectedPlanName: activePlan.name,
        tuitionAmount: activePlan.priceMonthly,
        notes: `Application initiated via Checkout (${studentData.paymentMethod.toUpperCase()}).`,
      };

      const createdLead = await api.createLead({
        tenantId: tenant.id,
        ...newStudentPayload,
      });

      // 2. Route to authentic Stripe checkout session if card payment
      if (studentData.paymentMethod === 'stripe') {
        const checkoutRes = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'student_tuition',
            tenantId: tenant.id,
            leadId: createdLead?.id,
            planId: activePlan.id,
            studentEmail: studentData.email,
            studentName: studentData.name,
            amount: activePlan.priceMonthly,
            description: `Admission Tuition: ${activePlan.name}`,
          }),
        });

        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
          return;
        } else {
          throw new Error(checkoutData.message || checkoutData.error || 'Could not initiate Stripe checkout session');
        }
      }

      // 3. For Bank Wire or alternative gateways, show confirmation step with instructions
      triggerEventNotification('payment_received', {
        amount: `$${activePlan.priceMonthly}`,
        payerName: studentData.name,
        gateway: studentData.paymentMethod.toUpperCase(),
      });

      setStep(4);
    } catch (err: any) {
      onAddToast({
        type: 'error',
        title: 'Checkout Error',
        message: err.message || 'Could not initiate payment session. Please verify your details or try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 4 ? 'Enrollment Complete' : `Enrollment Application — Step ${step} of 3`}
      description={tenant.name}
      maxWidth="lg"
    >
      {/* Step 1: Student Information */}
      {step === 1 && (
        <div className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            required
            value={studentData.name}
            onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
            placeholder="e.g. Tariq Mansour"
            leftIcon={<User className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              required
              value={studentData.email}
              onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
              placeholder="student@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="WhatsApp / Phone"
              type="tel"
              required
              value={studentData.phone}
              onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Country"
              value={studentData.country}
              onChange={(e) => setStudentData({ ...studentData, country: e.target.value })}
              options={[
                { value: 'United States', label: 'United States' },
                { value: 'United Kingdom', label: 'United Kingdom' },
                { value: 'Saudi Arabia', label: 'Saudi Arabia' },
                { value: 'United Arab Emirates', label: 'United Arab Emirates' },
                { value: 'Canada', label: 'Canada' },
                { value: 'Qatar', label: 'Qatar' },
                { value: 'Australia', label: 'Australia' },
              ]}
            />
            <Select
              label={isQuran ? 'Prior Quran / Hifz Level' : 'Current Experience Level'}
              value={studentData.priorLevel}
              onChange={(e) => setStudentData({ ...studentData, priorLevel: e.target.value })}
              options={
                isQuran
                  ? [
                      { value: 'Beginner', label: 'Beginner (Noorani Qaidah / Reading)' },
                      { value: 'Intermediate', label: 'Intermediate (1 to 5 Juz Memorized)' },
                      { value: 'Advanced', label: 'Advanced (10+ Juz Memorized)' },
                      { value: 'Ijazah Track', label: 'Ijazah Track (Complete Hafiz)' },
                    ]
                  : [
                      { value: 'Beginner', label: 'Beginner' },
                      { value: 'Intermediate', label: 'Intermediate' },
                      { value: 'Advanced', label: 'Advanced' },
                    ]
              }
            />
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              className="w-full"
              disabled={!studentData.name || !studentData.email || !studentData.phone}
              onClick={() => setStep(2)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Select Plan
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Select Plan */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">Choose your preferred tuition plan:</p>

          <div className="space-y-3">
            {tenant.pricingPlans.map((plan) => (
              <Card
                key={plan.id}
                onClick={() => setActivePlan(plan)}
                className={`cursor-pointer flex items-center justify-between p-5 transition-all ${
                  activePlan.id === plan.id ? 'border-slate-900 ring-2 ring-slate-900 bg-slate-50/50' : 'hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">{plan.name}</span>
                    {plan.popular && <Badge variant="success">Popular</Badge>}
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{plan.description}</p>
                </div>

                <div className="text-right">
                  <span className="text-base font-semibold font-mono text-slate-900">${plan.priceMonthly}</span>
                  <span className="text-[11px] text-slate-500">/mo</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-3">
            <Button variant="outline" className="w-1/3" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              variant="primary"
              className="w-2/3"
              onClick={() => setStep(3)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Payment (${activePlan.priceMonthly}/mo)
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <form onSubmit={handleSubmitEnrollment} className="space-y-4">
          <Card className="flex items-center justify-between p-4 bg-slate-50">
            <div>
              <span className="text-[10px] capitalize font-semibold text-slate-400">Selected Plan</span>
              <p className="font-semibold text-xs text-slate-900">{activePlan.name}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] capitalize font-semibold text-slate-400">Monthly Tuition</span>
              <p className="font-mono font-semibold text-slate-900 text-sm">${activePlan.priceMonthly} USD</p>
            </div>
          </Card>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStudentData({ ...studentData, paymentMethod: 'stripe' })}
                className={`p-3 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                  studentData.paymentMethod === 'stripe'
                    ? 'border-slate-900 bg-slate-50 text-slate-900 ring-2 ring-slate-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>Credit Card</span>
                <span className={`text-[10px] font-normal ${isStripeConnected ? 'text-emerald-600 font-medium' : 'text-amber-600'}`}>
                  {isStripeConnected ? 'Connected' : 'Not Connected'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStudentData({ ...studentData, paymentMethod: 'moyasar' })}
                className={`p-3 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                  studentData.paymentMethod === 'moyasar'
                    ? 'border-slate-900 bg-slate-50 text-slate-900 ring-2 ring-slate-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Mada / Apple Pay</span>
                <span className={`text-[10px] font-normal ${isMoyasarConnected ? 'text-emerald-600 font-medium' : 'text-amber-600'}`}>
                  {isMoyasarConnected ? 'Connected' : 'Not Connected'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStudentData({ ...studentData, paymentMethod: 'bank_transfer' })}
                className={`p-3 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                  studentData.paymentMethod === 'bank_transfer'
                    ? 'border-slate-900 bg-slate-50 text-slate-900 ring-2 ring-slate-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building className="w-5 h-5 text-slate-600 shrink-0" />
                <span>Bank Wire</span>
                <span className={`text-[10px] font-normal ${isBankConnected ? 'text-emerald-600 font-medium' : 'text-amber-600'}`}>
                  {isBankConnected ? 'Connected' : 'Not Connected'}
                </span>
              </button>
            </div>
          </div>

          {/* Unconnected Gateway Alert Banner */}
          {!isCurrentMethodConnected && (
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Payment Gateway Not Connected</p>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  {studentData.paymentMethod === 'stripe'
                    ? 'Stripe API keys have not been configured for this academy yet. Live card payments cannot be processed through this gateway.'
                    : studentData.paymentMethod === 'moyasar'
                    ? 'Moyasar API keys have not been configured for this academy yet. Mada and Apple Pay transactions cannot be processed.'
                    : 'Bank transfer details (IBAN / Account details) have not been provided for this academy yet.'}
                </p>
                <p className="text-amber-700 text-[10px] mt-1 font-medium">
                  Please select an available connected payment option or contact the academy administration.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-3">
            <Button variant="outline" type="button" className="w-1/3" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="w-2/3"
              isLoading={isProcessing}
              disabled={!isCurrentMethodConnected}
              rightIcon={<Lock className="w-3.5 h-3.5" />}
            >
              {isCurrentMethodConnected ? `Pay $${activePlan.priceMonthly} & Enroll` : 'Gateway Not Connected'}
            </Button>
          </div>
        </form>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="text-center py-6 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-900">Enrollment Successful!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your admission is confirmed. You can now access your student learning portal and join live sessions.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                router.push(`/${tenant.subdomain}/lms`);
              }}
            >
              Go to Student Portal
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
