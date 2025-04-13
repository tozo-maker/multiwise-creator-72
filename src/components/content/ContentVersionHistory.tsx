
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { History, Eye, RotateCcw, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { ContentService, ContentVersion } from '@/services/ContentService';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ContentVersionHistoryProps {
  contentId: string;
  currentVersion: number;
  onRestoreVersion: (version: ContentVersion) => void;
  onViewVersion?: (version: ContentVersion) => void;
}

export const ContentVersionHistory: React.FC<ContentVersionHistoryProps> = ({
  contentId,
  currentVersion,
  onRestoreVersion,
  onViewVersion
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [versions, setVersions] = React.useState<ContentVersion[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  
  React.useEffect(() => {
    const loadVersions = async () => {
      setIsLoading(true);
      try {
        const history = await ContentService.getVersionHistory(contentId);
        setVersions(history);
      } catch (error) {
        console.error('Error loading version history:', error);
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
  }, [contentId]);
  
  const handleViewVersion = (version: ContentVersion) => {
    if (onViewVersion) {
      onViewVersion(version);
    } else {
      // Default view behavior
      toast({
        title: 'View Version',
        description: `Viewing version ${version.version}`,
      });
    }
  };
  
  const handleRestoreVersion = (version: ContentVersion) => {
    onRestoreVersion(version);
  };
  
  // Format date for better readability
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <Card className={isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5" />
          <span>Version History</span>
        </CardTitle>
      </CardHeader>
      <Separator className={isDark ? 'bg-slate-700' : 'bg-slate-200'} />
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-500"></div>
          </div>
        ) : versions.length === 0 ? (
          <div className={`text-center py-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            No version history available
          </div>
        ) : (
          <div className="space-y-3">
            {/* Current version */}
            <div className={`p-3 rounded-md border ${
              isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    Current Version (v{currentVersion})
                  </div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Last updated: {new Date().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Previous versions */}
            {versions.map((version) => (
              <div 
                key={version.id}
                className={`p-3 rounded-md border ${
                  isDark ? 'border-slate-700 bg-transparent' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className={`font-medium cursor-help ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                          Version {version.version}
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent 
                        align="start" 
                        side="right" 
                        className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 mt-0.5 text-slate-500" />
                            <div>
                              <div className="text-xs font-medium">Created:</div>
                              <div className="text-sm">{formatDate(version.created_at)}</div>
                            </div>
                          </div>
                          {version.title && (
                            <div>
                              <div className="text-xs font-medium">Title:</div>
                              <div className="text-sm">{version.title}</div>
                            </div>
                          )}
                          {version.metadata?.wordCount && (
                            <div>
                              <div className="text-xs font-medium">Word count:</div>
                              <div className="text-sm">{version.metadata.wordCount} words</div>
                            </div>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    
                    <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {formatDate(version.created_at)}
                    </div>
                    {version.changes && (
                      <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {version.changes}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewVersion(version)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRestoreVersion(version)}
                      className="h-8 w-8 p-0"
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
