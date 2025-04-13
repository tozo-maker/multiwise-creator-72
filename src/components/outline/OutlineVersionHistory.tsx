
import React, { useEffect, useState } from 'react';
import { OutlineVersion } from '@/types/outline';
import { OutlineService } from '@/services/OutlineService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '@/contexts/ThemeContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface OutlineVersionHistoryProps {
  outlineId: string;
}

export const OutlineVersionHistory: React.FC<OutlineVersionHistoryProps> = ({ outlineId }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [versions, setVersions] = useState<OutlineVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadVersions = async () => {
      setIsLoading(true);
      const data = await OutlineService.getOutlineVersions(outlineId);
      setVersions(data);
      setIsLoading(false);
    };
    
    loadVersions();
  }, [outlineId]);
  
  const handleRestoreVersion = async (versionId: string) => {
    await OutlineService.restoreOutlineVersion(versionId);
    // Refresh versions
    const data = await OutlineService.getOutlineVersions(outlineId);
    setVersions(data);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }
  
  if (versions.length === 0) {
    return (
      <Alert>
        <AlertTitle>No version history</AlertTitle>
        <AlertDescription>
          There are no previous versions available for this outline.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      {versions.map((version) => (
        <div 
          key={version.id}
          className={`p-4 rounded-lg border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Version {version.version}
              </h4>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>
                  {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                </span>
              </div>
              {version.notes && (
                <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {version.notes}
                </p>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleRestoreVersion(version.id)}
              className="gap-1"
            >
              <RotateCcw size={14} />
              Restore
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
