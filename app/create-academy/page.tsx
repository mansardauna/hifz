'use client';

import React from 'react';
import { CreateAcademyPage } from '../../src/views/auth/CreateAcademyPage';
import { useRouter } from 'next/navigation';

export default function CreateAcademyRoutePage() {
  const router = useRouter();

  const handleAddToast = (toast: any) => {
    console.log('Create Academy Toast:', toast);
  };

  const handleSuccess = () => {
    router.push('/al-furqan/admin');
  };

  return <CreateAcademyPage onAddToast={handleAddToast} onSuccess={handleSuccess} />;
}
