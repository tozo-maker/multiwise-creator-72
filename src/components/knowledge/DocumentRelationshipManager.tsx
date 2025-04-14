
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DocumentInsightService } from '@/services/DocumentInsightService';
import { FileTypeIcon } from './FileTypeIcon';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentRelationshipManagerProps {
  fileId: string;
  projectId: string;
}

export const DocumentRelationshipManager: React.FC<DocumentRelationshipManagerProps> = ({
  fileId,
  projectId
}) => {
  const [relatedFiles, setRelatedFiles] = useState<Array<{ id: string; name: string; type: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchRelatedFiles = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, you would fetch the related files from the database
        // For now, we'll just simulate some related files
        setTimeout(() => {
          setRelatedFiles([
            { id: 'file1', name: 'Chapter 1 - Introduction.pdf', type: 'pdf' },
            { id: 'file2', name: 'Curriculum Standards.docx', type: 'docx' },
            { id: 'file3', name: 'Learning Objectives.xlsx', type: 'xlsx' }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching related files:', error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load related files",
          variant: "destructive"
        });
      }
    };
    
    if (fileId) {
      fetchRelatedFiles();
    }
  }, [fileId, toast]);
  
  const handleRemoveRelationship = (relatedFileId: string) => {
    setRelatedFiles(prev => prev.filter(file => file.id !== relatedFileId));
  };
  
  const handleSaveRelationships = async () => {
    setIsSaving(true);
    try {
      await DocumentInsightService.updateRelationships(
        fileId, 
        relatedFiles.map(file => file.id),
        projectId
      );
      
      toast({
        title: "Relationships updated",
        description: "Document relationships have been updated successfully",
      });
    } catch (error) {
      console.error('Error saving relationships:', error);
      toast({
        title: "Error",
        description: "Failed to update document relationships",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Related Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Loading related documents...</div>
        ) : relatedFiles.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No related documents found
          </div>
        ) : (
          <div className="space-y-2">
            {relatedFiles.map(file => (
              <div 
                key={file.id}
                className="flex items-center justify-between p-2 rounded-md border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center space-x-2">
                  <FileTypeIcon fileType={file.type} />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveRelationship(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <div className="mt-4">
              <Button 
                onClick={handleSaveRelationships} 
                disabled={isSaving}
                size="sm"
              >
                {isSaving ? "Saving..." : "Save Relationships"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
