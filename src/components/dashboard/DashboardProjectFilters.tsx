
import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useDashboard } from '@/contexts/DashboardContext';
import { cn } from '@/lib/utils';

interface DashboardProjectFiltersProps {
  className?: string;
}

export const DashboardProjectFilters: React.FC<DashboardProjectFiltersProps> = ({ 
  className 
}) => {
  const { searchTerm, setSearchTerm } = useDashboard();

  return (
    <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6", className)}>
      <div className="relative flex-1 max-w-md w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search projects" 
          className="pl-9 border-slate-200 transition-all focus:ring-2 focus:ring-brand-500/20" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search projects"
        />
      </div>
      
      <div className="flex gap-3 self-end md:self-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 gap-2 border-slate-200 transition-all hover:border-brand-200 hover:bg-brand-50">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="animate-in slide-in-from-top-5 fade-in-50">
            <DropdownMenuItem>All Projects</DropdownMenuItem>
            <DropdownMenuItem>Recent</DropdownMenuItem>
            <DropdownMenuItem>By Language</DropdownMenuItem>
            <DropdownMenuItem>By Type</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 gap-2 border-slate-200 transition-all hover:border-brand-200 hover:bg-brand-50">
              <ArrowUpDown className="h-4 w-4" />
              <span>Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="animate-in slide-in-from-top-5 fade-in-50">
            <DropdownMenuItem>Newest First</DropdownMenuItem>
            <DropdownMenuItem>Oldest First</DropdownMenuItem>
            <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
            <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
            <DropdownMenuItem>Progress (High-Low)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
