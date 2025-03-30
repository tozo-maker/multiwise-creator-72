
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, ChevronRight, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLocation } from 'react-router-dom';

interface HelpTip {
  id: string;
  title: string;
  content: string;
  pages: string[];
  read?: boolean;
}

export const ContextualHelp: React.FC = () => {
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState<HelpTip | null>(null);
  const [readTips, setReadTips] = useState<Record<string, boolean>>({});
  const location = useLocation();
  
  // Define help tips for different pages/contexts
  const helpTips: HelpTip[] = [
    {
      id: 'dashboard-intro',
      title: 'Dashboard Overview',
      content: 'The dashboard shows your recent projects and activity. Use the quick actions panel to access common tasks faster.',
      pages: ['/dashboard'],
    },
    {
      id: 'kb-file-management',
      title: 'Knowledge Base Management',
      content: 'Upload curriculum documents, style guides, and reference materials to improve AI-generated content. Organize files with categories and tags.',
      pages: ['/projects/:projectId/knowledge-base', '/projects/:projectId/knowledge-base/advanced'],
    },
    {
      id: 'content-creation',
      title: 'Content Generation',
      content: 'Select knowledge base files as context to improve the AI\'s understanding of your needs. The more specific your instructions, the better the output.',
      pages: ['/projects/:projectId/content', '/projects/:projectId/content/new'],
    },
    {
      id: 'project-workspace',
      title: 'Project Workspace',
      content: 'Your project workspace includes tabs for knowledge base, content, analysis, enhancements, configuration, and snapshots.',
      pages: ['/projects/:projectId'],
    }
  ];
  
  // Load read tips from localStorage
  useEffect(() => {
    const savedReadTips = localStorage.getItem('contextual-help-read-tips');
    if (savedReadTips) {
      setReadTips(JSON.parse(savedReadTips));
    }
  }, []);
  
  // Save read tips to localStorage when they change
  useEffect(() => {
    localStorage.setItem('contextual-help-read-tips', JSON.stringify(readTips));
  }, [readTips]);
  
  // Find relevant tips for the current page
  useEffect(() => {
    const currentPath = location.pathname;
    
    const matchingTips = helpTips.filter(tip => {
      return tip.pages.some(page => {
        // Handle routes with parameters
        if (page.includes(':')) {
          const pagePattern = page.replace(/:\w+/g, '[^/]+');
          const regex = new RegExp(`^${pagePattern}$`);
          return regex.test(currentPath);
        }
        return page === currentPath;
      });
    });
    
    // Filter out tips that have been read
    const unreadTips = matchingTips.filter(tip => !readTips[tip.id]);
    
    if (unreadTips.length > 0) {
      // Show the first unread tip after a short delay
      const tipToShow = unreadTips[0];
      const timeout = setTimeout(() => {
        setCurrentTip(tipToShow);
        setShowTip(true);
      }, 1000);
      
      return () => clearTimeout(timeout);
    } else {
      setShowTip(false);
      setCurrentTip(null);
    }
  }, [location.pathname, readTips]);
  
  const handleDismiss = () => {
    setShowTip(false);
    if (currentTip) {
      setReadTips(prev => ({
        ...prev,
        [currentTip.id]: true
      }));
    }
  };
  
  if (!showTip || !currentTip) {
    return null;
  }
  
  return (
    <div className="fixed bottom-16 right-4 z-40 animate-fade-in max-w-xs">
      <Card className="border-brand-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-brand-100 rounded-full p-1 mt-0.5">
              <Info className="h-4 w-4 text-brand-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-900 text-sm">
                {currentTip.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {currentTip.content}
              </p>
              <div className="flex justify-end mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs gap-1"
                  onClick={handleDismiss}
                >
                  Got it
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
