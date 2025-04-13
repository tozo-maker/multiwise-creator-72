
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { KBFile } from '@/components/knowledge/KnowledgeBaseFileList';

interface DocumentSearchParams {
  projectId?: string;
  query?: string;
  categories?: string[];
  tags?: string[];
  fileTypes?: string[];
  sortBy?: 'date' | 'name' | 'size';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

interface DocumentSearchResult {
  files: KBFile[];
  totalCount: number;
  hasMore: boolean;
}

export const useDocumentRetrieval = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [cachedResults, setCachedResults] = useState<Record<string, DocumentSearchResult>>({});
  
  // Generate a cache key from search parameters
  const getCacheKey = (params: DocumentSearchParams): string => {
    return JSON.stringify({
      projectId: params.projectId,
      query: params.query?.toLowerCase(),
      categories: params.categories?.sort(),
      tags: params.tags?.sort(),
      fileTypes: params.fileTypes?.sort(),
      sortBy: params.sortBy,
      sortDirection: params.sortDirection,
      limit: params.limit,
      offset: params.offset
    });
  };
  
  // Search documents with caching
  const searchDocuments = useCallback(async (params: DocumentSearchParams): Promise<DocumentSearchResult> => {
    const cacheKey = getCacheKey(params);
    
    // Check cache first
    if (cachedResults[cacheKey]) {
      return cachedResults[cacheKey];
    }
    
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('knowledge_base_files')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (params.projectId) {
        query = query.eq('project_id', params.projectId);
      }
      
      // Text search (simple case, could be enhanced with full-text search)
      if (params.query) {
        query = query.or(`name.ilike.%${params.query}%,description.ilike.%${params.query}%`);
      }
      
      // Category filter
      if (params.categories && params.categories.length > 0) {
        query = query.in('category', params.categories);
      }
      
      // File type filter
      if (params.fileTypes && params.fileTypes.length > 0) {
        query = query.in('file_type', params.fileTypes);
      }
      
      // Sorting
      if (params.sortBy) {
        const sortField = params.sortBy === 'date' ? 'created_at' : 
                          params.sortBy === 'name' ? 'name' : 
                          'size';
        const sortOrder = params.sortDirection || 'desc';
        query = query.order(sortField, { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      // Pagination
      if (params.limit) {
        query = query.limit(params.limit);
      }
      
      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      let filteredData = data || [];
      
      // Handle tag filtering in JS (since Supabase doesn't support array filtering well in this case)
      if (params.tags && params.tags.length > 0) {
        filteredData = filteredData.filter(file => {
          if (!file.tags) return false;
          return params.tags!.some(tag => file.tags.includes(tag));
        });
      }
      
      const result = {
        files: filteredData.map(file => ({
          id: file.id,
          name: file.name,
          description: file.description || '',
          fileType: file.file_type,
          size: file.size || 'Unknown',
          uploadDate: new Date(file.created_at).toLocaleDateString(),
          category: file.category || 'Other',
          url: file.url || '',
          tags: file.tags || [],
          project_id: file.project_id
        })),
        totalCount: count || filteredData.length,
        hasMore: (params.offset || 0) + (params.limit || 10) < (count || 0)
      };
      
      // Update cache
      setCachedResults(prev => ({
        ...prev,
        [cacheKey]: result
      }));
      
      return result;
    } catch (error) {
      console.error('Error retrieving documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to retrieve documents',
        variant: 'destructive'
      });
      
      return { files: [], totalCount: 0, hasMore: false };
    } finally {
      setIsLoading(false);
    }
  }, [cachedResults, toast]);
  
  // Clear cache when needed (e.g., after file operations)
  const clearCache = useCallback(() => {
    setCachedResults({});
  }, []);
  
  // Get a single document with caching
  const getDocumentById = useCallback(async (id: string): Promise<KBFile | null> => {
    // Check if document is in any cached result
    for (const key in cachedResults) {
      const file = cachedResults[key].files.find(f => f.id === id);
      if (file) return file;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('knowledge_base_files')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        fileType: data.file_type,
        size: data.size || 'Unknown',
        uploadDate: new Date(data.created_at).toLocaleDateString(),
        category: data.category || 'Other',
        url: data.url || '',
        tags: data.tags || [],
        project_id: data.project_id
      };
    } catch (error) {
      console.error('Error retrieving document:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cachedResults]);
  
  return {
    isLoading,
    searchDocuments,
    getDocumentById,
    clearCache
  };
};
