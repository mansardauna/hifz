import React from 'react';
import { CodingSandboxWorkspace } from '../../plugins/coding/CodingSandboxWorkspace';
import { ToastMessage } from '../../components/ui/Toast';

interface CodingLMSContainerProps {
  activeSubTab?: 'coding' | 'challenges' | 'projects';
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const CodingLMSContainer: React.FC<CodingLMSContainerProps> = ({
  activeSubTab = 'coding',
  onAddToast
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <CodingSandboxWorkspace />
    </div>
  );
};
