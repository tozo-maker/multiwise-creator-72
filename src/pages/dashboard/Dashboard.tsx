
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectList } from '@/components/projects/ProjectList';
import { NewProjectButton } from '@/components/projects/NewProjectButton';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardQuickActions } from '@/components/dashboard/DashboardQuickActions';
import { DashboardWelcome } from '@/components/dashboard/DashboardWelcome';
import { InteractiveHelp } from '@/components/dashboard/InteractiveHelp';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

export const Dashboard = () => {
  // Mock project data
  const projects = [
    {
      id: '1',
      name: 'Spanish Language Textbook',
      targetLanguage: 'Spanish',
      type: 'Textbook',
      lastModified: '2 hours ago',
      progress: 65
    },
    {
      id: '2',
      name: 'French Beginner Workbook',
      targetLanguage: 'French',
      type: 'Workbook',
      lastModified: '3 days ago',
      progress: 90
    },
    {
      id: '3',
      name: 'Chinese Characters Guide',
      targetLanguage: 'Chinese',
      type: 'Reference',
      lastModified: '1 week ago',
      progress: 45
    },
    {
      id: '4',
      name: 'German Grammar Worksheets',
      targetLanguage: 'German',
      type: 'Worksheet',
      lastModified: '2 weeks ago',
      progress: 80
    },
    {
      id: '5',
      name: 'English Teaching Guide',
      targetLanguage: 'English',
      type: 'Teacher Guide',
      lastModified: '3 weeks ago',
      progress: 25
    }
  ];

  // Mock statistics data
  const projectStats = {
    totalProjects: 5,
    activeProjects: 3,
    completedProjects: 2,
    contentCount: 32,
    knowledgeBaseFiles: 18,
    averageProgressRate: 61
  };

  const activityData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 8 },
    { name: 'Wed', value: 16 },
    { name: 'Thu', value: 7 },
    { name: 'Fri', value: 14 },
    { name: 'Sat', value: 3 },
    { name: 'Sun', value: 2 }
  ];

  const contentGenerationData = [
    { date: 'Jan', count: 4 },
    { date: 'Feb', count: 7 },
    { date: 'Mar', count: 5 },
    { date: 'Apr', count: 12 },
    { date: 'May', count: 9 },
    { date: 'Jun', count: 14 },
    { date: 'Jul', count: 18 }
  ];
  
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  
  useEffect(() => {
    // Check if this is user's first visit to dashboard
    const hasVisited = localStorage.getItem('hasVisitedDashboard');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('hasVisitedDashboard', 'true');
    }
    
    // Filter projects by search term
    setFilteredProjects(
      projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.targetLanguage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <MainLayout contentWidth="wide">
      <div className="space-y-6">
        {/* Welcome Card */}
        <DashboardWelcome 
          userName="John"
          hasProjects={projects.length > 0}
        />
        
        {/* First-time user help card */}
        {isFirstVisit && (
          <InteractiveHelp isNew={true} className="mb-6" />
        )}
        
        {/* Stats Overview */}
        <DashboardStats 
          projectStats={projectStats}
          activityData={activityData}
          contentGenerationData={contentGenerationData}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Section - Takes 2/3 of the width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recent Projects</h2>
                <NewProjectButton />
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md w-full">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search projects" 
                    className="pl-8" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-3 self-end md:self-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 gap-1">
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>All Projects</DropdownMenuItem>
                      <DropdownMenuItem>Recent</DropdownMenuItem>
                      <DropdownMenuItem>By Language</DropdownMenuItem>
                      <DropdownMenuItem>By Type</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 gap-1">
                        <ArrowUpDown className="h-4 w-4" />
                        Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Newest First</DropdownMenuItem>
                      <DropdownMenuItem>Oldest First</DropdownMenuItem>
                      <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                      <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                      <DropdownMenuItem>Progress (High-Low)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <ProjectList projects={filteredProjects} />
              
              {filteredProjects.length === 0 && (
                <div className="text-center py-12 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                  <h3 className="text-lg font-medium text-slate-700">No projects found</h3>
                  <p className="text-slate-500 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Actions and Recent Activity - Takes 1/3 of the width on large screens */}
          <div className="space-y-6">
            <DashboardQuickActions hasProjects={projects.length > 0} />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Your recent project activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { project: "Spanish Language Textbook", action: "Content generated", time: "2 hours ago" },
                    { project: "French Beginner Workbook", action: "Project configuration updated", time: "1 day ago" },
                    { project: "Chinese Characters Guide", action: "Knowledge base file added", time: "3 days ago" },
                    { project: "German Grammar Worksheets", action: "Snapshot created", time: "1 week ago" }
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-brand-500 mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{activity.project}</p>
                        <p className="text-xs text-slate-500">{activity.action} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
