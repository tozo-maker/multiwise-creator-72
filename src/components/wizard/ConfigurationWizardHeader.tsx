
import React from 'react';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';

interface ConfigurationWizardHeaderProps {
  title: string;
  description: string;
}

export const ConfigurationWizardHeader: React.FC<ConfigurationWizardHeaderProps> = ({ 
  title, 
  description 
}) => {
  return (
    <>
      <PageBreadcrumbs 
        items={[
          { label: 'Projects', path: '/projects' },
          { label: 'Create New Project' } // This is fine now since path is optional
        ]}
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-500 mt-2">{description}</p>
      </div>
    </>
  );
};

export default ConfigurationWizardHeader;
