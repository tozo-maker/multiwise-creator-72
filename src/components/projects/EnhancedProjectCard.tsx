
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, UsersIcon, BookIcon, LanguageIcon } from 'lucide-react';
import { ProjectQuickActions } from './list/ProjectQuickActions';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/contexts/ThemeContext';

export interface EnhancedProjectCardProps {
  id: string;
  name: string;
  description?: string;
  type: string;
  targetLanguage: string;
  progress: number;
  lastModified: string;
  status?: 'active' | 'archived' | 'completed';
  deadline?: string;
  owner?: string;
  collaborators?: number;
  documentCount?: number;
  wordCount?: number;
  complexity?: 'Basic' | 'Intermediate' | 'Advanced';
}

export const EnhancedProjectCard: React.FC<EnhancedProjectCardProps> = ({
  id,
  name,
  description,
  type,
  targetLanguage,
  progress,
  lastModified,
  status = 'active',
  deadline,
  owner,
  collaborators = 0,
  documentCount = 0,
  wordCount,
  complexity,
}) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const handleCardClick = () => {
    navigate(`/projects/${id}`);
  };
  
  const getStatusColor = () => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-slate-100 text-slate-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };
  
  const formatDeadline = () => {
    if (!deadline) return null;
    const date = new Date(deadline);
    const today = new Date();
    const isOverdue = date < today;
    
    return (
      <div className={`flex items-center ${isOverdue ? 'text-red-500' : 'text-slate-500'}`}>
        <CalendarIcon className="h-4 w-4 mr-1" />
        <span className="text-xs">
          Due {date.toLocaleDateString()}
          {isOverdue && ' (Overdue)'}
        </span>
      </div>
    );
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${
        status === 'archived' ? 'opacity-70' : ''
      } ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {name}
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {description || `A ${type} project in ${targetLanguage}`}
            </p>
          </div>
          <Badge className={getStatusColor()}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="py-2">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <BookIcon className="h-4 w-4 mr-2 text-slate-400" />
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{type}</span>
          </div>
          
          <div className="flex items-center">
            <LanguageIcon className="h-4 w-4 mr-2 text-slate-400" />
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{targetLanguage}</span>
          </div>
          
          {collaborators > 0 && (
            <div className="flex items-center">
              <UsersIcon className="h-4 w-4 mr-2 text-slate-400" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {collaborators} {collaborators === 1 ? 'collaborator' : 'collaborators'}
              </span>
            </div>
          )}
          
          {documentCount > 0 && (
            <div className="flex items-center">
              <BookIcon className="h-4 w-4 mr-2 text-slate-400" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {documentCount} {documentCount === 1 ? 'document' : 'documents'}
              </span>
            </div>
          )}
          
          {wordCount && (
            <div className="flex items-center">
              <span className="text-xs text-slate-500">
                {wordCount.toLocaleString()} words
              </span>
            </div>
          )}
          
          {complexity && (
            <div className="flex items-center">
              <span className="text-xs text-slate-500">
                {complexity} complexity
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs mb-1">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Progress</span>
            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{progress}%</span>
          </div>
          <Progress value={progress} />
          {deadline && formatDeadline()}
        </div>
      </CardContent>
      
      <CardFooter className={`pt-2 border-t ${
        isDark ? 'border-slate-700' : 'border-slate-100'
      }`}>
        <div className="flex w-full justify-between items-center">
          <div className="text-xs text-slate-500">
            Updated: {lastModified}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <ProjectQuickActions 
              project={{
                id,
                name,
                description,
                type,
                targetLanguage,
                lastModified,
                progress,
                status
              }} 
              size="compact"
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EnhancedProjectCard;
