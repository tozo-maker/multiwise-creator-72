
import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/contexts/DashboardContext';

export const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useDashboard();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  return (
    <div className="relative w-full max-w-3xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          type="text" 
          placeholder="Search projects, files, and more..." 
          className="pl-10 pr-10 bg-slate-50 border-slate-200 focus:bg-white w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-slate-800"
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          aria-label="Toggle advanced search"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
      {showAdvancedSearch && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg p-4 animate-in fade-in-50 slide-in-from-top-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Filter by</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">Type: All</Button>
                <Button variant="outline" size="sm" className="w-full justify-start">Status: All</Button>
                <Button variant="outline" size="sm" className="w-full justify-start">Language: All</Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Search in</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">Projects</Button>
                <Button variant="outline" size="sm" className="w-full justify-start">Documents</Button>
                <Button variant="outline" size="sm" className="w-full justify-start">Content</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
