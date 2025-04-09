
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { KBFile } from '@/components/knowledge/KnowledgeBaseFileList';
import { KBCategory } from '@/components/knowledge/KnowledgeBaseCategories';

export const useKnowledgeBaseFiles = (projectId?: string) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [files, setFiles] = useState<KBFile[]>([]);
  const [categories, setCategories] = useState<KBCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKnowledgeBaseFiles = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      console.log('Fetching knowledge base files...');
      console.log('Project ID:', projectId || 'No specific project, fetching all files');
      
      // Build the query
      let query = supabase
        .from('knowledge_base_files')
        .select('*')
        .order('created_at', { ascending: false });
      
      // If projectId is provided, filter by that project
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching knowledge base files:', error);
        throw error;
      }
      
      console.log('Knowledge Base files fetched:', data);
      
      if (!data || data.length === 0) {
        console.log('No knowledge base files found');
        setFiles([]);
        setCategories([]);
        setIsLoading(false);
        return;
      }
      
      // Transform data to match KBFile interface
      const formattedFiles = data.map(file => ({
        id: file.id,
        name: file.name,
        description: file.description || '',
        fileType: file.file_type,
        size: file.size || 'Unknown',
        uploadDate: new Date(file.created_at).toLocaleDateString(),
        category: file.category || 'Other',
        url: file.url || ''
      }));
      
      console.log('Formatted files:', formattedFiles);
      setFiles(formattedFiles);
      
      // Generate categories based on files
      updateCategories(formattedFiles);
    } catch (error) {
      console.error('Error fetching knowledge base files:', error);
      toast({
        title: 'Error',
        description: 'Failed to load knowledge base files',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategories = (filesList: KBFile[]) => {
    const categoryMap = new Map<string, number>();
    
    filesList.forEach(file => {
      const category = file.category || 'Other';
      const count = categoryMap.get(category) || 0;
      categoryMap.set(category, count + 1);
    });
    
    // Generate random colors for categories
    const categoryColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    
    // Convert to category objects
    const categoryList: KBCategory[] = Array.from(categoryMap.entries()).map(([name, count], index) => ({
      id: `cat-${index}`,
      name,
      count,
      color: categoryColors[index % categoryColors.length]
    }));
    
    console.log('Generated categories:', categoryList);
    setCategories(categoryList);
  };

  useEffect(() => {
    fetchKnowledgeBaseFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, projectId]);

  return {
    files,
    setFiles,
    categories,
    isLoading,
    updateCategories,
    refreshFiles: fetchKnowledgeBaseFiles
  };
};
