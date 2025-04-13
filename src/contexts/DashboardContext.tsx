
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectStats as mockProjectStats, activityData as mockActivityData, contentGenerationData as mockContentGenerationData } from '@/data/mockData';
import { Project } from '@/types/supabase-custom';
import { ProjectService } from '@/services/ProjectService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  refreshError: string | null;
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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterLanguage, setFilterLanguage] = useState('All Languages');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoadingError, setDataLoadingError] = useState<string | null>(null);
  const [realActivityData, setRealActivityData] = useState<ActivityData[]>([]);
  const [realContentGeneration, setRealContentGeneration] = useState<ContentGenerationData[]>([]);
  const [contentItemsCount, setContentItemsCount] = useState(0);
  const [knowledgeBaseFilesCount, setKnowledgeBaseFilesCount] = useState(0);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const isDemo = false;
  
  console.log('Current user:', user?.email);
  
  const fetchProjects = async () => {
    if (!user) {
      return [];
    }
    
    try {
      const data = await ProjectService.getAll();
      return data;
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Project Fetch Error",
        description: error.message || "Failed to fetch projects",
        variant: "destructive"
      });
      return [];
    }
  };

  const fetchContentItemsCount = async () => {
    if (!user) return 0;
    
    try {
      const { count, error } = await supabase
        .from('content_items')
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      
      console.log('Content items count:', count);
      return count || 0;
    } catch (error) {
      console.error('Error fetching content items count:', error);
      return 0;
    }
  };
  
  const fetchKnowledgeBaseFilesCount = async () => {
    if (!user) return 0;
    
    try {
      const { count, error } = await supabase
        .from('knowledge_base_files')
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      
      console.log('Knowledge base files count:', count);
      return count || 0;
    } catch (error) {
      console.error('Error fetching knowledge base files count:', error);
      return 0;
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
    setRefreshError(null);
    try {
      const projectsData = await fetchProjects();
      const contentCount = await fetchContentItemsCount();
      const knowledgeBaseCount = await fetchKnowledgeBaseFilesCount();
      
      setProjects(projectsData);
      setContentItemsCount(contentCount);
      setKnowledgeBaseFilesCount(knowledgeBaseCount);
      
      // Fetch activity data
      try {
        const activityData = await ProjectService.getActivityData();
        setRealActivityData(activityData.length > 0 ? activityData : emptyActivityData);
      } catch (error) {
        console.error('Error fetching activity data:', error);
        setRealActivityData(emptyActivityData);
      }
      
      // Fetch content generation data
      try {
        const contentGenData = await ProjectService.getContentGenerationData();
        setRealContentGeneration(contentGenData.length > 0 ? contentGenData : emptyContentGenerationData);
      } catch (error) {
        console.error('Error fetching content generation data:', error);
        setRealContentGeneration(emptyContentGenerationData);
      }

      toast({
        title: "Dashboard Refreshed",
        description: "Your dashboard data has been updated",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Dashboard refresh error:', error);
      setRefreshError(error.message || 'Failed to refresh dashboard');
      
      toast({
        title: "Refresh Failed",
        description: error.message || "Unable to update dashboard data",
        variant: "destructive"
      });
    }
  };

  const initializeDashboard = async () => {
    setIsLoading(true);
    setDataLoadingError(null);
    
    if (user) {
      try {
        console.log('User authenticated, fetching data');
        
        // Fetch projects
        const projectsData = await fetchProjects();
        setProjects(projectsData);
        
        // Fetch counts
        const contentCount = await fetchContentItemsCount();
        setContentItemsCount(contentCount);
        
        const filesCount = await fetchKnowledgeBaseFilesCount();
        setKnowledgeBaseFilesCount(filesCount);
        
        // Fetch analytics data
        await fetchAnalyticsData();
        
      } catch (error: any) {
        console.error('Error initializing dashboard:', error);
        setDataLoadingError(error.message || 'Failed to load dashboard data');
        
        toast({
          title: "Dashboard Load Error",
          description: "There was a problem loading your dashboard data. Please try refreshing.",
          variant: "destructive"
        });
      } finally {
        // Set loading to false after all data fetching attempts
        setIsLoading(false);
      }
    } else {
      // Reset loading state if no user
      setIsLoading(false);
      console.log('No user detected');
    }
  };

  useEffect(() => {
    // Initialize dashboard when user changes
    if (user) {
      initializeDashboard();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        isDemo,
        refreshError
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
