
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KnowledgeBaseMain } from '@/components/knowledge/KnowledgeBaseMain';

const KnowledgeBasePage = () => {
  return (
    <DashboardLayout 
      contentWidth="wide" 
      pageTitle="Knowledge Base"
      pageDescription="Access and manage your educational resources"
      mainId="knowledge-base-main"
      aria-label="Knowledge Base page"
    >
      <KnowledgeBaseMain />
    </DashboardLayout>
  );
};

export default KnowledgeBasePage;
