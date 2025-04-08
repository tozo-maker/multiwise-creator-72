
import React, { useState } from 'react';
import { ProjectCard, ProjectCardProps } from './ProjectCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, SortAsc, SortDesc, Download, BarChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useDashboard } from '@/contexts/DashboardContext';

interface ProjectListProps {
  projects: ProjectCardProps[];
  isLoading?: boolean;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, isLoading = false }) => {
  // Get existing search term from DashboardContext to avoid duplicating functionality
  const { searchTerm: globalSearchTerm } = useDashboard();
  const [filterType, setFilterType] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'progress'| 'name'>('newest');
  const navigate = useNavigate();
  
  const projectTypes = Array.from(new Set(projects.map(project => project.type)));
  
  const filteredProjects = projects
    .filter(project => 
      project.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) &&
      (filterType === null || project.type === filterType)
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return parseInt(b.id) - parseInt(a.id);
        case 'oldest':
          return parseInt(a.id) - parseInt(b.id);
        case 'progress':
          return b.progress - a.progress;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  
  const displayProjects = filteredProjects.slice(0, window.location.pathname === '/dashboard' ? 6 : filteredProjects.length);
  
  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Your project data is being prepared for export.",
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Project data exported successfully.",
      });
      console.log("Project data export (would download CSV in production)");
    }, 1500);
  };
  
  const goToAnalytics = () => {
    navigate('/analytics');
  };
    
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32 ml-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  
  if (projects.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300 dark:bg-slate-800 dark:border-slate-700"
      >
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-8 h-8 text-slate-400 dark:text-slate-300"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">No projects yet</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-4">Get started by creating your first educational project</p>
        <div className="flex justify-center">
          <Button 
            onClick={() => navigate('/projects/new')}
            className="bg-brand-500 hover:bg-brand-600 text-white flex items-center gap-2"
            size="sm"
          >
            <span>New Project</span>
          </Button>
        </div>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-4 project-list-container">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {filterType || 'All Types'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterType(null)}>
                All Types
              </DropdownMenuItem>
              {projectTypes.map(type => (
                <DropdownMenuItem key={type} onClick={() => setFilterType(type)}>
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {sortOrder === 'newest' || sortOrder === 'progress' ? 
                  <SortDesc className="h-4 w-4" /> : 
                  <SortAsc className="h-4 w-4" />
                }
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder('newest')}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('progress')}>
                Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('name')}>
                Name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="ml-auto flex gap-2 items-center">
          {window.location.pathname !== '/dashboard' && projects.length > 0 && (
            <>
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={handleExportData}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={goToAnalytics}
              >
                <BarChart className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {displayProjects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700"
          >
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">No matching projects</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={() => {
              setFilterType(null);
            }}>
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {displayProjects.map(project => (
              <motion.div key={project.id} variants={itemVariants}>
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {window.location.pathname === '/dashboard' && projects.length > 6 && (
        <div className="col-span-full mt-6 text-center">
          <Button 
            variant="outline" 
            className="border-dashed border-slate-300 transition-all hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600"
            onClick={() => navigate('/projects')}
          >
            View all {projects.length} projects
          </Button>
        </div>
      )}
    </div>
  );
};
