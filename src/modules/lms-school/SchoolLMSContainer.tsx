import React from 'react';
import { SchoolCoursesView } from '../../plugins/school/SchoolCoursesView';
import { SchoolAssignmentsPortal } from '../../plugins/school/SchoolAssignmentsPortal';
import { SchoolReportCardView } from '../../plugins/school/SchoolReportCardView';
import { SchoolTimetableView } from '../../plugins/school/SchoolTimetableView';
import { ToastMessage } from '../../components/ui/Toast';

interface SchoolLMSContainerProps {
  activeSubTab?: 'courses' | 'assignments' | 'grades' | 'schedule';
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const SchoolLMSContainer: React.FC<SchoolLMSContainerProps> = ({
  activeSubTab = 'courses',
  onAddToast
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {activeSubTab === 'courses' && <SchoolCoursesView />}
      {activeSubTab === 'assignments' && <SchoolAssignmentsPortal />}
      {activeSubTab === 'grades' && <SchoolReportCardView />}
      {activeSubTab === 'schedule' && <SchoolTimetableView />}
    </div>
  );
};
