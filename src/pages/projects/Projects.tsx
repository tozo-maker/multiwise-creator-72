
import React from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectList } from '@/components/projects/ProjectList';
import { useDashboard } from '@/contexts/DashboardContext';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Add a status field to the filtered projects if it doesn't exist already
const addStatusIfMissing = (projects: any[]) => {
  return projects.map(project => ({
    ...project,
    status: project.status || 'active' // Default to 'active' if status is missing
  }));
};

export const Projects = () => {
  const { filteredProjects: originalFilteredProjects } = useDashboard();
  // Ensure all projects have a status field
  const filteredProjects = addStatusIfMissing(originalFilteredProjects);
  
  return (
    <ModernLayout contentWidth="wide">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              View and manage all your educational content projects.
            </p>
          </div>
          
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
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
    </ModernLayout>
  );
};

export default Projects;
