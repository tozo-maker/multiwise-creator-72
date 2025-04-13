
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Eye, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DocumentVersion {
  id: string;
  file_id: string;
  version_number: number;
  url: string;
  created_at: string;
  created_by: string;
  size: string;
  change_summary?: string;
}

interface DocumentVersionHistoryProps {
  fileId: string;
  currentVersion?: number;
  onRestoreVersion?: (version: DocumentVersion) => void;
}

export const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  fileId,
  currentVersion = 1,
  onRestoreVersion
}) => {
  const { toast } = useToast();
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadVersions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('document_versions')
          .select('*')
          .eq('file_id', fileId)
          .order('version_number', { ascending: false });
          
        if (error) throw error;
        
        setVersions(data || []);
      } catch (error) {
        console.error('Error loading document versions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load version history',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVersions();
  }, [fileId, toast]);

  const handleViewVersion = (version: DocumentVersion) => {
    if (version.url) {
      window.open(version.url, '_blank');
    } else {
      toast({
        title: 'Error',
        description: 'Version URL not available',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadVersion = (version: DocumentVersion) => {
    if (version.url) {
      const link = document.createElement('a');
      link.href = version.url;
      link.download = `v${version.version_number}_${fileId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRestoreVersion = (version: DocumentVersion) => {
    if (onRestoreVersion) {
      onRestoreVersion(version);
    } else {
      toast({
        title: 'Not implemented',
        description: 'Version restoration is not available for this file',
      });
    }
  };

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5" />
          <span>Version History</span>
        </CardTitle>
      </CardHeader>
      <Separator className="bg-slate-200" />
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-500"></div>
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-6 text-slate-600">
            No version history available
          </div>
        ) : (
          <div className="space-y-3">
            {/* Current version */}
            <div className="p-3 rounded-md border bg-slate-50 border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">
                    Current Version (v{currentVersion})
                  </div>
                  <div className="text-xs mt-1 text-slate-500">
                    Latest version
                  </div>
                </div>
              </div>
            </div>
            
            {/* Previous versions */}
            {versions.map((version) => (
              <div 
                key={version.id}
                className="p-3 rounded-md border border-slate-200 bg-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-800">
                      Version {version.version_number}
                    </div>
                    <div className="text-xs mt-1 text-slate-500">
                      {new Date(version.created_at).toLocaleString()}
                    </div>
                    {version.change_summary && (
                      <div className="text-xs mt-1 text-slate-600">
                        {version.change_summary}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewVersion(version)}
                      className="h-8 w-8 p-0"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadVersion(version)}
                      className="h-8 w-8 p-0"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRestoreVersion(version)}
                      className="h-8 w-8 p-0"
                      title="Restore"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
