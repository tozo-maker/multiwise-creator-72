
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, FileText, BarChart, Image, Video } from 'lucide-react';

interface KnowledgeBaseTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const KnowledgeBaseTabs: React.FC<KnowledgeBaseTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid grid-cols-5 h-auto p-1">
        <TabsTrigger value="all" className="flex items-center gap-2 py-2">
          <File className="h-4 w-4" />
          <span>All Files</span>
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center gap-2 py-2">
          <FileText className="h-4 w-4" />
          <span>Documents</span>
        </TabsTrigger>
        <TabsTrigger value="images" className="flex items-center gap-2 py-2">
          <Image className="h-4 w-4" />
          <span>Images</span>
        </TabsTrigger>
        <TabsTrigger value="videos" className="flex items-center gap-2 py-2">
          <Video className="h-4 w-4" />
          <span>Videos</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2 py-2">
          <BarChart className="h-4 w-4" />
          <span>Analytics</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
