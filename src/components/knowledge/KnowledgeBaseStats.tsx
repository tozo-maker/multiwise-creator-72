
import React from 'react';
import { KBFile } from '@/components/knowledge/KnowledgeBaseFileList';
import { useKnowledgeBaseStats } from '@/hooks/useKnowledgeBaseStats';

interface KnowledgeBaseStatsProps {
  files: KBFile[];
}

export const KnowledgeBaseStats: React.FC<KnowledgeBaseStatsProps> = ({ files }) => {
  const stats = useKnowledgeBaseStats(files);
  
  return (
    <div className="hidden">
      {/* This component doesn't render anything visible, but provides stats through the hook */}
    </div>
  );
};

// Export the hook directly for easier access to stats
export const getKnowledgeBaseStats = (files: KBFile[]) => {
  return useKnowledgeBaseStats(files);
};
