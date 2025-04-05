
import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';
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
  const { setSearchTerm } = useDashboard();

  return (
    <div className={cn("flex justify-end items-center gap-3 mb-6", className)}>      
      <div className="flex gap-3">
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
