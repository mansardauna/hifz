'use client';

import React from 'react';
import { SignInPage } from '../../src/components/auth/SignInPage';

export default function LoginPage() {
  const handleAddToast = (toast: any) => {
    console.log('Login Toast:', toast);
  };

  return <SignInPage onAddToast={handleAddToast} />;
}
