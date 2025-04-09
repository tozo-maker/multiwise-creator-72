
import React from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectList } from '@/components/projects/ProjectList';
import { useDashboard, DashboardProvider } from '@/contexts/DashboardContext';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from '@/contexts/ThemeContext';

// Add a status field to the filtered projects if it doesn't exist already
const addStatusIfMissing = (projects: any[]) => {
  return projects.map(project => ({
    ...project,
    status: project.status || 'active' // Default to 'active' if status is missing
  }));
};

// Create a wrapper component that uses the DashboardProvider
const ProjectsContent = () => {
  const { filteredProjects: originalFilteredProjects } = useDashboard();
  const { theme } = useTheme();
  
  // Ensure all projects have a status field
  const filteredProjects = addStatusIfMissing(originalFilteredProjects);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-6">
        <div>
          <h1 className={`text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Projects</h1>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            View and manage all your educational content projects.
          </p>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className={theme === 'dark' ? '' : 'bg-slate-100'}>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ProjectList projects={filteredProjects} />
          </TabsContent>
          <TabsContent value="recent">
            <ProjectList projects={filteredProjects.slice(0, 3)} />
          </TabsContent>
          <TabsContent value="active">
            <ProjectList projects={filteredProjects.filter(p => p.status === 'active')} />
          </TabsContent>
          <TabsContent value="archived">
            <ProjectList projects={filteredProjects.filter(p => p.status === 'archived')} />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

// Main component that wraps the content with DashboardProvider
export const Projects = () => {
  return (
    <ModernLayout contentWidth="wide">
      <DashboardProvider>
        <ProjectsContent />
      </DashboardProvider>
    </ModernLayout>
  );
};

export default Projects;
