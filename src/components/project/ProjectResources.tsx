import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Book, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeBaseFile } from '@/types/supabase-custom';
import { useAuth } from '@/contexts/UnifiedAuthContext';

interface ProjectResourcesProps {
  projectId: string;
}

export const ProjectResources: React.FC<ProjectResourcesProps> = ({ projectId }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();
  const [resources, setResources] = useState<KnowledgeBaseFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchResources = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        console.log('Fetching resources for project:', projectId);
        
        const { data, error } = await supabase
          .from('knowledge_base_files')
          .select('*')
          .eq('project_id', projectId)
          .limit(3);
          
        if (error) {
          console.error('Error fetching resources:', error);
          return;
        }
        
        console.log('Resources fetched:', data);
        
        if (data) {
          const formattedResources = data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            fileType: item.file_type,
            size: item.size,
            uploadDate: new Date(item.created_at).toLocaleDateString(),
            url: item.url,
            category: item.category || undefined,
          }));
          setResources(formattedResources);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResources();
  }, [projectId, user]);
  
  const getIconForResource = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type === 'pdf' || type === 'docx' || type === 'doc' || type === 'txt') {
      return FileText;
    } else if (type === 'url' || type.includes('http')) {
      return LinkIcon;
    } else {
      return Book;
    }
  };
  
  const handleViewResource = (resource: KnowledgeBaseFile) => {
    if (resource.url) {
      window.open(resource.url, '_blank');
    }
  };
  
  return (
    <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Project Resources</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className={`${
            isDark 
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
          asChild
        >
          <Link to={`/projects/${projectId}/knowledge-base`}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Resource
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin h-6 w-6 border-2 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Loading resources...</p>
          </div>
        ) : resources.length > 0 ? (
          <div className={isDark ? "divide-y divide-slate-700" : "divide-y divide-slate-200"}>
            {resources.map(resource => {
              const IconComponent = getIconForResource(resource.fileType);
              return (
                <div key={resource.id} className="flex items-center gap-3 py-3">
                  <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{resource.name}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{resource.fileType} • {resource.uploadDate}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`px-2 gap-1 ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`}
                    onClick={() => handleViewResource(resource)}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>No resources added yet.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              asChild
            >
              <Link to={`/projects/${projectId}/knowledge-base`}>
                Add Resources
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
