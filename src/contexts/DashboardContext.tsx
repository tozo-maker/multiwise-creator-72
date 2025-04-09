
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectStats, activityData, contentGenerationData } from '@/data/mockData';
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
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await ProjectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProjects = async () => {
    await fetchProjects();
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
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

  // Calculate project stats from actual projects
  const calculateProjectStats = (): ProjectStats => {
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalProjects = projects.length;
    
    // For now, use mock data for content count and knowledge base files
    return {
      totalProjects,
      activeProjects,
      completedProjects,
      contentCount: projectStats.contentCount,
      knowledgeBaseFiles: projectStats.knowledgeBaseFiles,
      averageProgressRate: totalProjects ? projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects : 0
    };
  };

  return (
    <DashboardContext.Provider
      value={{
        projects,
        filteredProjects,
        projectStats: calculateProjectStats(),
        activityData,
        contentGenerationData,
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
        refreshProjects
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
