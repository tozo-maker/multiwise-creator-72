
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectStats as mockProjectStats, activityData as mockActivityData, contentGenerationData as mockContentGenerationData } from '@/data/mockData';
import { Project } from '@/types/supabase-custom';
import { ProjectService } from '@/services/ProjectService';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  
  // Check if this is a demo user or a real user
  // A demo user is one with email 'demo@example.com' or no user at all
  const isDemo = !user || user.email === 'demo@example.com';
  
  console.log('Current user:', user?.email);
  console.log('Is demo user:', isDemo);

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

  const fetchAnalyticsData = async () => {
    if (!user || isDemo) return;
    
    try {
      console.log('Fetching real analytics data for user:', user.id);
      // For real users, fetch real activity data
      const activityResult = await ProjectService.getActivityData();
      if (activityResult && activityResult.length > 0) {
        console.log('Fetched real activity data:', activityResult);
        setRealActivityData(activityResult);
      } else {
        console.log('No real activity data found, using mock data');
      }
      
      // Fetch real content generation data
      const contentResult = await ProjectService.getContentGenerationData();
      if (contentResult && contentResult.length > 0) {
        console.log('Fetched real content generation data:', contentResult);
        setRealContentGeneration(contentResult);
      } else {
        console.log('No real content generation data found, using mock data');
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const refreshProjects = async () => {
    await fetchProjects();
    if (!isDemo) {
      await fetchAnalyticsData();
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching data');
      fetchProjects();
      
      // Only fetch analytics data for non-demo users
      if (!isDemo) {
        console.log('Real user detected, fetching analytics data');
        fetchAnalyticsData();
      } else {
        console.log('Demo user detected, using mock data');
      }
    } else {
      // Reset loading state if no user
      setIsLoading(false);
      console.log('No user detected, using mock data');
    }
  }, [user, isDemo]);
  
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

  // Calculate project stats from actual projects
  const calculateProjectStats = (): ProjectStats => {
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalProjects = projects.length;
    
    if (isDemo) {
      // For demo users, use mock data for additional stats
      return {
        totalProjects,
        activeProjects,
        completedProjects,
        contentCount: mockProjectStats.contentCount,
        knowledgeBaseFiles: mockProjectStats.knowledgeBaseFiles,
        averageProgressRate: totalProjects ? projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects : 0
      };
    } else {
      // For real users, calculate from actual projects
      // For now we have limited real data, so we'll use some real and some calculated values
      return {
        totalProjects,
        activeProjects,
        completedProjects,
        // Count files from knowledge base (this is a placeholder - ideally we would fetch this)
        contentCount: totalProjects * 3, // Estimate 3 content items per project as a placeholder
        knowledgeBaseFiles: Math.max(1, Math.round(totalProjects * 1.5)), // Estimate 1.5 files per project
        averageProgressRate: totalProjects ? projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects : 0
      };
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        projects,
        filteredProjects,
        projectStats: calculateProjectStats(),
        activityData: isDemo ? mockActivityData : realActivityData.length > 0 ? realActivityData : mockActivityData,
        contentGenerationData: isDemo ? mockContentGenerationData : realContentGeneration.length > 0 ? realContentGeneration : mockContentGenerationData,
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
