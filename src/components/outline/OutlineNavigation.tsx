
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, File, CheckCircle, Circle, Clock } from 'lucide-react';
import { ProjectOutline, OutlineSection, OutlineItem } from '@/types/outline';
import { useTheme } from '@/contexts/ThemeContext';
import { Skeleton } from '@/components/ui/skeleton';
import { OutlineService } from '@/services/OutlineService';
import { cn } from '@/lib/utils';

interface OutlineNavigationProps {
  projectId: string;
  activeItemId?: string;
  onItemSelect?: (item: OutlineItem) => void;
  displayMode?: 'navigation' | 'sidebar' | 'compact';
}

export const OutlineNavigation: React.FC<OutlineNavigationProps> = ({
  projectId,
  activeItemId,
  onItemSelect,
  displayMode = 'navigation'
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  
  const [outline, setOutline] = useState<ProjectOutline | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchOutline = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      try {
        const outlineData = await OutlineService.getOutlineByProject(projectId);
        if (outlineData) {
          const sections = await OutlineService.getSectionsByOutline(outlineData.id);
          setOutline({
            ...outlineData,
            sections
          });
          
          // Expand all sections by default in navigation mode
          if (displayMode === 'navigation') {
            const initialExpandedState: Record<string, boolean> = {};
            sections.forEach(section => {
              initialExpandedState[section.id] = true;
            });
            setExpandedSections(initialExpandedState);
          }
        }
      } catch (error) {
        console.error('Error fetching outline:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOutline();
  }, [projectId, displayMode]);
  
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  const handleItemClick = (item: OutlineItem) => {
    if (onItemSelect) {
      onItemSelect(item);
    } else if (item.contentId) {
      navigate(`/projects/${projectId}/content/${item.contentId}`);
    } else {
      navigate(`/projects/${projectId}/content/create?outlineItemId=${item.id}`);
    }
  };
  
  const getStatusIcon = (item: OutlineItem) => {
    switch (item.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'not_started':
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };
  
  if (isLoading) {
    return (
      <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-2/3" />
        </CardContent>
      </Card>
    );
  }
  
  if (!outline || outline.sections.length === 0) {
    return (
      <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
        <CardContent className="p-4">
          <div className="text-center p-4">
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              No outline available for this project.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn(
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white',
      displayMode === 'compact' && 'p-0'
    )}>
      <CardContent className={cn(
        "space-y-2",
        displayMode === 'compact' ? 'p-2' : 'p-4'
      )}>
        {displayMode !== 'compact' && (
          <h2 className={`text-lg font-medium mb-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            Project Outline
          </h2>
        )}
        
        <div className="space-y-2">
          {outline.sections.map((section) => (
            <div key={section.id} className="space-y-1">
              <button
                onClick={() => toggleSection(section.id)}
                className={cn(
                  "flex items-center w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700",
                  isDark ? 'text-slate-200' : 'text-slate-800'
                )}
              >
                {expandedSections[section.id] ? (
                  <ChevronDown className="w-4 h-4 mr-1" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-1" />
                )}
                <span className="font-medium">{section.title}</span>
              </button>
              
              {expandedSections[section.id] && (
                <div className={`ml-6 space-y-1 ${displayMode === 'compact' ? 'text-sm' : ''}`}>
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "flex items-center w-full text-left px-2 py-1 rounded",
                        activeItemId === item.id
                          ? 'bg-brand-50 text-brand-700 font-medium'
                          : isDark 
                            ? 'text-slate-300 hover:bg-slate-700'
                            : 'text-slate-700 hover:bg-slate-100',
                        displayMode === 'compact' && 'text-xs py-0.5'
                      )}
                    >
                      <File className={`mr-1.5 ${displayMode === 'compact' ? 'w-3 h-3' : 'w-4 h-4'}`} />
                      <span className="flex-1 truncate">{item.title}</span>
                      {getStatusIcon(item)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
