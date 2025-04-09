import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectStats as mockProjectStats, activityData as mockActivityData, contentGenerationData as mockContentGenerationData } from '@/data/mockData';
import { Project } from '@/types/supabase-custom';
import { ProjectService } from '@/services/ProjectService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Define types for our context
export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  contentCount: number;
  knowledgeBaseFiles: number;
  averageProgressRate: number;
}

export interface ActivityData {
  name: string;
  value: number;
}

export interface ContentGenerationData {
  date: string;
  count: number;
}

interface DashboardContextType {
  projects: Project[];
  filteredProjects: Project[];
  projectStats: ProjectStats;
  activityData: ActivityData[];
  contentGenerationData: ContentGenerationData[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterLanguage: string;
  setFilterLanguage: (language: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  showActiveOnly: boolean;
  setShowActiveOnly: (show: boolean) => void;
  isLoading: boolean;
  isFirstVisit: boolean;
  refreshProjects: () => Promise<void>;
  isDemo: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

// Create empty default data for real users with no data
const emptyActivityData: ActivityData[] = [
  { name: 'Mon', value: 0 },
  { name: 'Tue', value: 0 },
  { name: 'Wed', value: 0 },
  { name: 'Thu', value: 0 },
  { name: 'Fri', value: 0 },
  { name: 'Sat', value: 0 },
  { name: 'Sun', value: 0 }
];

const emptyContentGenerationData: ContentGenerationData[] = [
  { date: 'Jan', count: 0 },
  { date: 'Feb', count: 0 },
  { date: 'Mar', count: 0 },
  { date: 'Apr', count: 0 },
  { date: 'May', count: 0 },
  { date: 'Jun', count: 0 },
  { date: 'Jul', count: 0 }
];

const emptyProjectStats: ProjectStats = {
  totalProjects: 0,
  activeProjects: 0,
  completedProjects: 0,
  contentCount: 0,
  knowledgeBaseFiles: 0,
  averageProgressRate: 0
};

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterLanguage, setFilterLanguage] = useState('All Languages');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [realActivityData, setRealActivityData] = useState<ActivityData[]>([]);
  const [realContentGeneration, setRealContentGeneration] = useState<ContentGenerationData[]>([]);
  const [contentItemsCount, setContentItemsCount] = useState(0);
  const [knowledgeBaseFilesCount, setKnowledgeBaseFilesCount] = useState(0);
  const { user } = useAuth();
  
  const isDemo = false;
  
  console.log('Current user:', user?.email);
  
  const fetchProjects = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Fetching projects for user:', user.id);
      const data = await ProjectService.getAll();
      console.log('Fetched projects:', data);
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Still set projects to empty array on error
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContentItemsCount = async () => {
    if (!user) return;
    
    try {
      const { count, error } = await supabase
        .from('content_items')
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      
      console.log('Content items count:', count);
      setContentItemsCount(count || 0);
    } catch (error) {
      console.error('Error fetching content items count:', error);
      setContentItemsCount(0);
    }
  };
  
  const fetchKnowledgeBaseFilesCount = async () => {
    if (!user) return;
    
    try {
      const { count, error } = await supabase
        .from('knowledge_base_files')
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      
      console.log('Knowledge base files count:', count);
      setKnowledgeBaseFilesCount(count || 0);
    } catch (error) {
      console.error('Error fetching knowledge base files count:', error);
      setKnowledgeBaseFilesCount(0);
    }
  };

  const fetchAnalyticsData = async () => {
    if (!user) return;
    
    try {
      console.log('Fetching real analytics data for user:', user.id);
      // For real users, fetch real activity data
      const activityResult = await ProjectService.getActivityData();
      if (activityResult && activityResult.length > 0) {
        console.log('Fetched real activity data:', activityResult);
        setRealActivityData(activityResult);
      } else {
        console.log('No real activity data found, using empty data');
        setRealActivityData(emptyActivityData);
      }
      
      // Fetch real content generation data
      const contentResult = await ProjectService.getContentGenerationData();
      if (contentResult && contentResult.length > 0) {
        console.log('Fetched real content generation data:', contentResult);
        setRealContentGeneration(contentResult);
      } else {
        console.log('No real content generation data found, using empty data');
        setRealContentGeneration(emptyContentGenerationData);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Use empty data on error for real users
      setRealActivityData(emptyActivityData);
      setRealContentGeneration(emptyContentGenerationData);
    }
  };

  const refreshProjects = async () => {
    await fetchProjects();
    await fetchContentItemsCount();
    await fetchKnowledgeBaseFilesCount();
    await fetchAnalyticsData();
  };

  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching data');
      fetchProjects();
      fetchContentItemsCount();
      fetchKnowledgeBaseFilesCount();
      fetchAnalyticsData();
    } else {
      // Reset loading state if no user
      setIsLoading(false);
      console.log('No user detected');
    }
  }, [user]);
  
  useEffect(() => {
    // Check if this is user's first visit to dashboard
    const hasVisited = localStorage.getItem('hasVisitedDashboard');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('hasVisitedDashboard', 'true');
    }
  }, []);

  useEffect(() => {
    // Filter projects by search term, type, language, and active status
    let filtered = [...projects];
    
    // Apply search filter if set
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.targetLanguage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter if not set to 'All Types'
    if (filterType !== 'All Types') {
      filtered = filtered.filter(project => project.type === filterType);
    }
    
    // Apply language filter if not set to 'All Languages'
    if (filterLanguage !== 'All Languages') {
      filtered = filtered.filter(project => project.targetLanguage === filterLanguage);
    }
    
    // Apply active filter if set
    if (showActiveOnly) {
      filtered = filtered.filter(project => project.progress < 100 && project.progress > 0);
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          // For db results, using string comparison of IDs or date comparison
          return a.id > b.id ? -1 : 1;
        case 'oldest':
          return a.id < b.id ? -1 : 1;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'progress-desc':
          return b.progress - a.progress;
        case 'progress-asc':
          return a.progress - b.progress;
        default:
          return 0;
      }
    });
    
    setFilteredProjects(filtered);
  }, [searchTerm, filterType, filterLanguage, sortOrder, showActiveOnly, projects]);

  const calculateProjectStats = (): ProjectStats => {
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalProjects = projects.length;
    
    return {
      totalProjects,
      activeProjects,
      completedProjects,
      contentCount: contentItemsCount,
      knowledgeBaseFiles: knowledgeBaseFilesCount,
      averageProgressRate: totalProjects > 0 ? projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects : 0
    };
  };

  return (
    <DashboardContext.Provider
      value={{
        projects,
        filteredProjects,
        projectStats: calculateProjectStats(),
        activityData: realActivityData.length > 0 ? realActivityData : emptyActivityData,
        contentGenerationData: realContentGeneration.length > 0 ? realContentGeneration : emptyContentGenerationData,
        searchTerm,
        setSearchTerm,
        filterType,
        setFilterType,
        filterLanguage,
        setFilterLanguage,
        sortOrder,
        setSortOrder,
        showActiveOnly,
        setShowActiveOnly,
        isLoading,
        isFirstVisit,
        refreshProjects,
        isDemo
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
