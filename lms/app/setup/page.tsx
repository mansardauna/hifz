import React from 'react';
import { SetupWizardClient } from '@/components/setup/SetupWizardClient';

export const metadata = {
  title: 'Setup & Installation Wizard • Ankabit LMS',
  description: 'Enterprise multi-database deployment and initialization wizard.',
};

export default function SetupPage() {
  return <SetupWizardClient />;
}
