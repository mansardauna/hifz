'use client';

import React from 'react';
import { SaasLandingPage } from '../src/views/SaasLandingPage';
import { useRouter } from 'next/navigation';

export default function RootHomePage() {
  const router = useRouter();

  const handleNavigateToAuth = (route: string) => {
    if (route.includes('create-academy')) router.push('/create-academy');
    else if (route.includes('login') || route.includes('signin')) router.push('/login');
    else if (route.includes('register') || route.includes('signup')) router.push('/register');
    else router.push('/');
  };

  const handleNavigateToDemo = (tenantSubdomain: string) => {
    router.push(`/${tenantSubdomain}`);
  };

  return (
    <SaasLandingPage
      onNavigateToAuth={handleNavigateToAuth}
      onNavigateToDemo={handleNavigateToDemo}
    />
  );
}
