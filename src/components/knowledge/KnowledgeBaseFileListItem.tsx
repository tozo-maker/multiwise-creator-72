
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EyeIcon, PencilIcon, TrashIcon, DownloadIcon, BrainIcon, Link } from 'lucide-react';
import { FileTypeIcon } from './FileTypeIcon';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DocumentInsights } from './DocumentInsights';
import { useDocumentProcessor } from '@/hooks/useDocumentProcessor';
import { DocumentInsightService } from '@/services/DocumentInsightService';
import { DocumentRelationshipManager } from './DocumentRelationshipManager';
import { KBFile } from './KnowledgeBaseFileList';

interface KnowledgeBaseFileListItemProps {
  file: {
    id: string;
    name: string;
    description: string;
    fileType: string;
    size: string;
    uploadDate: string;
    category?: string;
    url: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  projectId?: string;
  projectFiles?: KBFile[];
}

export const KnowledgeBaseFileListItem: React.FC<KnowledgeBaseFileListItemProps> = ({
  file,
  onEdit,
  onDelete,
  onPreview,
  onDownload,
  projectId,
  projectFiles = []
}) => {
  const [insightDialogOpen, setInsightDialogOpen] = useState(false);
  const [insight, setInsight] = useState<any>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  
  const { processDocument, isProcessing } = useDocumentProcessor({
    onSuccess: (data) => {
      setInsight(data.insights);
    }
  });
  
  const handleViewInsights = async () => {
    setInsightDialogOpen(true);
    setIsLoadingInsight(true);
    
    try {
      // First try to get existing insights
      const existingInsight = await DocumentInsightService.getByFileId(file.id);
      
      if (existingInsight) {
        setInsight(existingInsight);
      } else {
        setInsight(null);
      }
    } catch (error) {
      console.error("Error loading document insights:", error);
      setInsight(null);
    } finally {
      setIsLoadingInsight(false);
    }
  };
  
  const handleProcessDocument = async () => {
    if (!projectId) return;
    
    try {
      await processDocument(file.id, projectId);
    } catch (error) {
      console.error("Error processing document:", error);
    }
  };
  
  const handleRelationshipsUpdated = () => {
    // Refresh insights if needed
    if (insightDialogOpen) {
      handleViewInsights();
    }
  };

  return (
    <>
      <tr className="border-b border-slate-200 dark:border-slate-700">
        <td className="py-3 px-4">
          <div className="flex items-center">
            <FileTypeIcon fileType={file.fileType} className="mr-3 flex-shrink-0" />
            <div>
              <div className="font-medium text-slate-900 dark:text-slate-200">{file.name}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{file.description}</div>
            </div>
          </div>
        </td>
        <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell">{file.category || 'Other'}</td>
        <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell">{file.fileType}</td>
        <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell">{file.size}</td>
        <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell">{file.uploadDate}</td>
        <td className="py-3 px-4">
          <div className="flex items-center justify-end space-x-2">
            {projectId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewInsights}
                title="View AI insights"
              >
                <BrainIcon className="h-4 w-4" />
              </Button>
            )}
            {projectId && projectFiles.length > 0 && (
              <DocumentRelationshipManager 
                currentFileId={file.id}
                projectId={projectId}
                projectFiles={projectFiles}
                onRelationshipsUpdated={handleRelationshipsUpdated}
              />
            )}
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => onPreview(file.id)}
              title="Preview file"
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(file.id)}
              title="Edit description"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDownload(file.id)}
              title="Download file"
            >
              <DownloadIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(file.id)}
              title="Delete file"
              className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
      
      {/* Document Insights Dialog */}
      <Dialog open={insightDialogOpen} onOpenChange={setInsightDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DocumentInsights 
            fileId={file.id}
            projectId={projectId}
            insight={insight} 
            isLoading={isLoadingInsight || isProcessing} 
            fileName={file.name}
            onProcessDocument={handleProcessDocument}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
