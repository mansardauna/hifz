'use client';

import React from 'react';
import { SignUpPage } from '../../src/components/auth/SignUpPage';

export default function RegisterPage() {
  const handleAddToast = (toast: any) => {
    console.log('Register Toast:', toast);
  };

  return <SignUpPage onAddToast={handleAddToast} />;
}
