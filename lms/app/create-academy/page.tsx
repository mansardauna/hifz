'use client';

import React from 'react';
import { CreateAcademyPage } from '../../src/views/auth/CreateAcademyPage';
import { useRouter } from 'next/navigation';

export default function CreateAcademyRoutePage() {
  const router = useRouter();

  const handleAddToast = (toast: any) => {
    console.log('Create Academy Toast:', toast);
  };

  const handleSuccess = (subdomain?: string) => {
    if (subdomain) {
      router.push(`/${subdomain}/admin`);
    } else {
      router.push('/login');
    }
  };

  return <CreateAcademyPage onAddToast={handleAddToast} onSuccess={handleSuccess} />;
}
