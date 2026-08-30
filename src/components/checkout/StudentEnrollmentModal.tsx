import React, { useState } from 'react';
import { PricingPlan, Lead } from '../../types';
import { useTenant } from '../../context/TenantContext';
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
  Lock
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

  const handleSubmitEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const newStudent: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
        name: studentData.name,
        studentName: studentData.name,
        email: studentData.email,
        phone: studentData.phone,
        country: studentData.country,
        courseInterest: activePlan.name,
        preferredSchedule: 'Evening Track',
        priorHifzLevel: studentData.priorLevel,
        status: 'Admitted',
        paymentStatus: 'Paid',
        selectedPlanId: activePlan.id,
        selectedPlanName: activePlan.name,
        tuitionAmount: activePlan.priceMonthly,
        notes: `Enrolled via Checkout (${studentData.paymentMethod.toUpperCase()}).`,
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

      await api.createLead({
        tenantId: tenant.id,
        ...newStudent,
      });

      onAddToast({
        type: 'success',
        title: 'Enrollment Confirmed',
        message: `Welcome to ${tenant.name}! Your enrollment has been processed.`,
      });

      setStep(4);
    } catch (err) {
      onAddToast({
        type: 'error',
        title: 'Submission Error',
        message: 'Could not complete registration. Please try again.',
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
            placeholder="e.g. Mariam Mansoor"
            leftIcon={<User className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              label="Phone Number"
              type="tel"
              required
              value={studentData.phone}
              onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
              placeholder="+1 555 0199"
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Experience Level"
              value={studentData.priorLevel}
              onChange={(e) => setStudentData({ ...studentData, priorLevel: e.target.value })}
              options={[
                { value: 'Beginner', label: 'Beginner / Foundational' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' },
              ]}
            />

            <Input
              label="Parent / Guardian Name (Optional)"
              type="text"
              value={studentData.parentName}
              onChange={(e) => setStudentData({ ...studentData, parentName: e.target.value })}
              placeholder="e.g. John Doe"
            />
          </div>

          <Button
            variant="primary"
            className="w-full mt-4"
            disabled={!studentData.name || !studentData.email || !studentData.phone}
            onClick={() => setStep(2)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continue to Tuition Plans
          </Button>
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
                className={`cursor-pointer flex items-center justify-between p-4 ${
                  activePlan.id === plan.id ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-50/50' : ''
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{plan.name}</span>
                    {plan.popular && <Badge variant="success">Popular</Badge>}
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{plan.description}</p>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold font-mono text-slate-900">${plan.priceMonthly}</span>
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
          <Card className="flex items-center justify-between p-3.5 bg-slate-50">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Selected Plan</span>
              <p className="font-bold text-xs text-slate-900">{activePlan.name}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Tuition</span>
              <p className="font-mono font-bold text-slate-900 text-sm">${activePlan.priceMonthly} USD</p>
            </div>
          </Card>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStudentData({ ...studentData, paymentMethod: 'stripe' })}
                className={`p-3 rounded-lg border text-center text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  studentData.paymentMethod === 'stripe'
                    ? 'border-slate-900 bg-slate-50 text-slate-900 ring-1 ring-slate-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setStudentData({ ...studentData, paymentMethod: 'moyasar' })}
                className={`p-3 rounded-lg border text-center text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  studentData.paymentMethod === 'moyasar'
                    ? 'border-slate-900 bg-slate-50 text-slate-900 ring-1 ring-slate-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Mada / Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setStudentData({ ...studentData, paymentMethod: 'bank_transfer' })}
                className={`p-3 rounded-lg border text-center text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  studentData.paymentMethod === 'bank_transfer'
                    ? 'border-slate-900 bg-slate-50 text-slate-900 ring-1 ring-slate-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Bank Wire</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <Button variant="outline" type="button" className="w-1/3" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="w-2/3"
              isLoading={isProcessing}
              rightIcon={<Lock className="w-3.5 h-3.5" />}
            >
              Pay ${activePlan.priceMonthly} & Enroll
            </Button>
          </div>
        </form>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Enrollment Successful!</h3>
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
