
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface EmptyProjectsListProps {
  filtered?: boolean;
}

export const EmptyProjectsList: React.FC<EmptyProjectsListProps> = ({ filtered = false }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`text-center py-12 rounded-lg border border-dashed ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700 text-slate-300'
          : 'bg-white border-slate-300 text-slate-700'
      }`}
    >
      {filtered ? (
        <>
          <h3 className={`text-lg font-medium mb-1 ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
          }`}>No matching projects</h3>
          <p className={`${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          } mb-4`}>Try adjusting your search or filters</p>
          <Button variant="outline" onClick={() => navigate('/projects')}>
            Clear Filters
          </Button>
        </>
      ) : (
        <>
          <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full ${
            theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
          }`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className={`w-8 h-8 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-400'
              }`}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" 
              />
            </svg>
          </div>
          <h3 className={`text-lg font-medium mb-1 ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
          }`}>No projects yet</h3>
          <p className={`${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          } mb-4`}>Get started by creating your first educational project</p>
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/projects/new')}
              className="bg-brand-500 hover:bg-brand-600 text-white flex items-center gap-2"
              size="sm"
            >
              <span>New Project</span>
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
};
