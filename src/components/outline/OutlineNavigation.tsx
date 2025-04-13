
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, File, CheckCircle, Circle, Clock, Search, Calendar, AlertTriangle } from 'lucide-react';
import { ProjectOutline, OutlineSection, OutlineItem } from '@/types/outline';
import { useTheme } from '@/contexts/ThemeContext';
import { Skeleton } from '@/components/ui/skeleton';
import { OutlineService } from '@/services/OutlineService';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OutlineNavigationProps {
  projectId: string;
  activeItemId?: string;
  onItemSelect?: (item: OutlineItem) => void;
  displayMode?: 'navigation' | 'sidebar' | 'compact';
  showFilters?: boolean;
}

export const OutlineNavigation: React.FC<OutlineNavigationProps> = ({
  projectId,
  activeItemId,
  onItemSelect,
  displayMode = 'navigation',
  showFilters = true
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  
  const [outline, setOutline] = useState<ProjectOutline | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);
  
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
          
          // Calculate overall progress
          calculateOverallProgress(sections);
        }
      } catch (error) {
        console.error('Error fetching outline:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOutline();
  }, [projectId, displayMode]);
  
  const calculateOverallProgress = (sections: OutlineSection[]) => {
    let totalItems = 0;
    let completedValue = 0;
    
    sections.forEach(section => {
      section.items.forEach(item => {
        totalItems++;
        const percentage = item.metadata?.completionPercentage || 
          (item.status === 'completed' ? 100 : 
           item.status === 'in_progress' ? 50 : 0);
        
        completedValue += percentage;
      });
    });
    
    const progress = totalItems > 0 ? Math.round(completedValue / (totalItems * 100) * 100) : 0;
    setOverallProgress(progress);
  };
  
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
    // Check for past due items first
    if (item.metadata?.dueDate) {
      const dueDate = new Date(item.metadata.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today && item.status !== 'completed') {
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      }
    }
    
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
  
  const getFormattedDueDate = (item: OutlineItem) => {
    if (!item.metadata?.dueDate) return null;
    
    const date = new Date(item.metadata.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    
    // Check if the due date is in the past
    const isPastDue = date < today && item.status !== 'completed';
    
    return { formattedDate, isPastDue };
  };
  
  const filteredSections = outline?.sections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      const matchesSearch = !searchTerm || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesStatus = !statusFilter || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
  })).filter(section => section.items.length > 0) || [];
  
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
        displayMode === 'compact' ? 'p-2' : 'p-4'
      )}>
        {displayMode !== 'compact' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className={`text-lg font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Project Outline
              </h2>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {overallProgress}%
                      </span>
                      <Progress value={overallProgress} className="w-20 h-2" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Overall project completion</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {showFilters && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search outline..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-8 ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}
                  />
                </div>
                
                <div className="flex flex-wrap gap-1">
                  <Badge 
                    variant={!statusFilter ? "secondary" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setStatusFilter(null)}
                  >
                    All
                  </Badge>
                  <Badge 
                    variant={statusFilter === 'not_started' ? "secondary" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setStatusFilter('not_started')}
                  >
                    Not Started
                  </Badge>
                  <Badge 
                    variant={statusFilter === 'in_progress' ? "secondary" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setStatusFilter('in_progress')}
                  >
                    In Progress
                  </Badge>
                  <Badge 
                    variant={statusFilter === 'completed' ? "secondary" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setStatusFilter('completed')}
                  >
                    Completed
                  </Badge>
                </div>
              </div>
            )}
          </div>
        )}
        
        <ScrollArea className={displayMode !== 'compact' ? "h-[calc(100vh-350px)]" : "h-[calc(100vh-250px)]"}>
          <div className="space-y-2 pr-2 pt-2">
            {filteredSections.length === 0 ? (
              <p className="text-center text-sm text-slate-500 py-4">
                No items match your filters
              </p>
            ) : (
              filteredSections.map((section) => (
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
                    <span className="text-xs ml-2 text-slate-500">({section.items.length})</span>
                  </button>
                  
                  {expandedSections[section.id] && (
                    <div className={`ml-6 space-y-1 ${displayMode === 'compact' ? 'text-sm' : ''}`}>
                      {section.items.map((item) => {
                        const dueDateInfo = getFormattedDueDate(item);
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={cn(
                              "flex items-center w-full text-left px-2 py-1 rounded-sm",
                              activeItemId === item.id
                                ? isDark 
                                  ? 'bg-slate-700 text-brand-300 font-medium'
                                  : 'bg-brand-50 text-brand-700 font-medium'
                                : isDark 
                                  ? 'text-slate-300 hover:bg-slate-700'
                                  : 'text-slate-700 hover:bg-slate-100',
                              displayMode === 'compact' && 'text-xs py-0.5'
                            )}
                          >
                            <div className="mr-2">
                              {getStatusIcon(item)}
                            </div>
                            <span className="flex-1 truncate">{item.title}</span>
                            
                            <div className="flex items-center gap-2">
                              {item.contentId && (
                                <File className={`${displayMode === 'compact' ? 'w-3 h-3' : 'w-4 h-4'} text-blue-500`} />
                              )}
                              
                              {dueDateInfo && dueDateInfo.isPastDue && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Calendar className={`${displayMode === 'compact' ? 'w-3 h-3' : 'w-4 h-4'} text-red-500`} />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Past due: {dueDateInfo.formattedDate}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
