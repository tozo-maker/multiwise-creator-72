
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KnowledgeBaseMain } from '@/components/knowledge/KnowledgeBaseMain';
import { DashboardProvider } from '@/contexts/DashboardContext';

const KnowledgeBasePage = () => {
  return (
    <DashboardLayout 
      contentWidth="wide" 
      pageTitle="Knowledge Base"
      pageDescription="Access and manage your educational resources"
      mainId="knowledge-base-main"
      aria-label="Knowledge Base page"
    >
      <DashboardProvider>
        <KnowledgeBaseMain />
      </DashboardProvider>
    </DashboardLayout>
  );
};

export default KnowledgeBasePage;
