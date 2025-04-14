
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Link, Network } from 'lucide-react';
import { DocumentInsightService } from '@/services/document-insights';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { KBFile } from './KnowledgeBaseFileList';
import { FileTypeIcon } from './FileTypeIcon';

interface DocumentRelationshipManagerProps {
  currentFileId: string;
  projectId: string;
  projectFiles: KBFile[];
  onRelationshipsUpdated?: () => void;
}

export const DocumentRelationshipManager: React.FC<DocumentRelationshipManagerProps> = ({
  currentFileId,
  projectId,
  projectFiles,
  onRelationshipsUpdated
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [relatedFileIds, setRelatedFileIds] = useState<string[]>([]);
  const { toast } = useToast();
  
  const currentFile = projectFiles.find(file => file.id === currentFileId);
  
  // Load related files when dialog opens
  useEffect(() => {
    const fetchRelatedFiles = async () => {
      if (!isOpen) return;
      
      try {
        setIsLoading(true);
        const insight = await DocumentInsightService.getByFileId(currentFileId);
        
        if (insight?.related_files) {
          setRelatedFileIds(insight.related_files);
        } else {
          setRelatedFileIds([]);
        }
      } catch (error) {
        console.error('Error fetching related files:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRelatedFiles();
  }, [currentFileId, isOpen]);
  
  // Handle toggling a file's relationship
  const toggleFileRelationship = (fileId: string) => {
    if (relatedFileIds.includes(fileId)) {
      setRelatedFileIds(prev => prev.filter(id => id !== fileId));
    } else {
      setRelatedFileIds(prev => [...prev, fileId]);
    }
  };
  
  // Save relationships
  const handleSave = async () => {
    try {
      setIsLoading(true);
      await DocumentInsightService.updateRelationships(currentFileId, relatedFileIds);
      
      toast({
        title: "Relationships Updated",
        description: "Document relationships have been updated successfully"
      });
      
      if (onRelationshipsUpdated) {
        onRelationshipsUpdated();
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating relationships:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update document relationships",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        title="Manage document relationships"
        className="gap-1"
      >
        <Link className="h-4 w-4" />
        Document Relationships
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Document Relationships</DialogTitle>
            <DialogDescription>
              Link this document with related documents to establish connections for AI analysis.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {currentFile && (
              <div className="mb-4 p-2 bg-slate-100 rounded-md flex items-center">
                <FileTypeIcon fileType={currentFile.fileType} className="mr-2" />
                <div>
                  <p className="font-semibold">{currentFile.name}</p>
                  <p className="text-sm text-slate-500">Current document</p>
                </div>
              </div>
            )}
            
            <div className="text-sm font-medium text-slate-700 mb-2">Select related documents:</div>
            
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
                  <p className="mt-2 text-sm text-slate-500">Loading related documents...</p>
                </div>
              ) : projectFiles.filter(file => file.id !== currentFileId).length === 0 ? (
                <p className="text-sm text-slate-500 py-2">No other documents found in this project.</p>
              ) : (
                projectFiles
                  .filter(file => file.id !== currentFileId)
                  .map(file => (
                    <div key={file.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-slate-50">
                      <Checkbox
                        id={`file-${file.id}`}
                        checked={relatedFileIds.includes(file.id)}
                        onCheckedChange={() => toggleFileRelationship(file.id)}
                        disabled={isLoading}
                      />
                      <div className="grid gap-1 leading-none">
                        <div className="flex items-center">
                          <FileTypeIcon fileType={file.fileType} className="mr-2 h-4 w-4" />
                          <Label htmlFor={`file-${file.id}`} className="font-medium cursor-pointer">
                            {file.name}
                          </Label>
                        </div>
                        {file.description && (
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {file.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Relationships'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
