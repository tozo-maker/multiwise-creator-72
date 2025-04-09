import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projects, projectStats, activityData, contentGenerationData } from '@/data/mockData';
import { Project } from '@/types/supabase-custom';

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
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    // Check if this is user's first visit to dashboard
    const hasVisited = localStorage.getItem('hasVisitedDashboard');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('hasVisitedDashboard', 'true');
    }

    return () => clearTimeout(timer);
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
          // For demo, using id as proxy for creation date
          return parseInt(b.id) - parseInt(a.id);
        case 'oldest':
          return parseInt(a.id) - parseInt(b.id);
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
  }, [searchTerm, filterType, filterLanguage, sortOrder, showActiveOnly]);

  return (
    <DashboardContext.Provider
      value={{
        projects,
        filteredProjects,
        projectStats,
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
        isFirstVisit
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
