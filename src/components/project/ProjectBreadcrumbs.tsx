
import React from 'react';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';

interface ProjectBreadcrumbsProps {
  projectName: string;
}

export const ProjectBreadcrumbs: React.FC<ProjectBreadcrumbsProps> = ({ projectName }) => {
  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
    { label: projectName }
  ];
  
  return (
    <div className="pt-4">
      <PageBreadcrumbs items={breadcrumbItems} />
    </div>
  );
};
