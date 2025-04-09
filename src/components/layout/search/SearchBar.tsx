
import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

export const SearchBar = ({ searchTerm: externalSearchTerm, setSearchTerm: externalSetSearchTerm }: SearchBarProps) => {
  // Use internal state for standalone mode when not within DashboardProvider
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Use provided or internal state
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
  const setSearchTerm = externalSetSearchTerm || setInternalSearchTerm;

  return (
    <div className="relative w-full max-w-3xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
        <Input 
          type="text" 
          placeholder="Search projects, files, and more..." 
          className="pl-10 pr-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-300"
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          aria-label="Toggle advanced search"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
      {showAdvancedSearch && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg dark:shadow-slate-900/50 p-4 animate-in fade-in-50 slide-in-from-top-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2 dark:text-slate-300">Filter by</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start dark:border-slate-700 dark:text-slate-300">Type: All</Button>
                <Button variant="outline" size="sm" className="w-full justify-start dark:border-slate-700 dark:text-slate-300">Status: All</Button>
                <Button variant="outline" size="sm" className="w-full justify-start dark:border-slate-700 dark:text-slate-300">Language: All</Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2 dark:text-slate-300">Search in</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start dark:border-slate-700 dark:text-slate-300">Projects</Button>
                <Button variant="outline" size="sm" className="w-full justify-start dark:border-slate-700 dark:text-slate-300">Documents</Button>
                <Button variant="outline" size="sm" className="w-full justify-start dark:border-slate-700 dark:text-slate-300">Content</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
