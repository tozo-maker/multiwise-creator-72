
import React from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { KnowledgeBaseMain } from '@/components/knowledge/KnowledgeBaseMain';

export const KnowledgeBasePage = () => {
  return (
    <ModernLayout contentWidth="wide">
      <KnowledgeBaseMain />
    </ModernLayout>
  );
};

export default KnowledgeBasePage;
