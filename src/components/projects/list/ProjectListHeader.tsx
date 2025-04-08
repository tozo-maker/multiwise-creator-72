
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, SortAsc, SortDesc, Download, BarChart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { ProjectCardProps } from '../ProjectCard';

interface ProjectListHeaderProps {
  projects: ProjectCardProps[];
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  sortOrder: 'newest' | 'oldest' | 'progress' | 'name';
  setSortOrder: (order: 'newest' | 'oldest' | 'progress' | 'name') => void;
}

export const ProjectListHeader: React.FC<ProjectListHeaderProps> = ({
  projects,
  filterType,
  setFilterType,
  sortOrder,
  setSortOrder
}) => {
  const navigate = useNavigate();
  const projectTypes = Array.from(new Set(projects.map(project => project.type)));
  
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

  return (
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
  );
};
