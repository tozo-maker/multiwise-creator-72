
import React, { useEffect, useState } from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectList } from '@/components/projects/ProjectList';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/supabase-custom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Add a status field to the filtered projects if it doesn't exist already
const addStatusIfMissing = (projects: any[]) => {
  return projects.map(project => ({
    ...project,
    status: project.status || 'active' // Default to 'active' if status is missing
  }));
};

// Create a wrapper component that uses the DashboardProvider
const ProjectsContent = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        const formattedProjects = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || undefined,
          type: item.type,
          targetLanguage: item.target_language,
          lastModified: new Date(item.updated_at).toLocaleDateString(),
          progress: item.progress,
          status: item.status as 'active' | 'archived' | 'completed',
        }));
        
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [user]);
  
  // Ensure all projects have a status field
  const filteredProjects = addStatusIfMissing(projects);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Projects</h1>
            <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              View and manage all your educational content projects.
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/projects/create')}
            className="gap-2 bg-brand-600 hover:bg-brand-700 text-white"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className={theme === 'dark' ? '' : 'bg-slate-100'}>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ProjectList projects={filteredProjects} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="recent">
            <ProjectList projects={filteredProjects.slice(0, 3)} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="active">
            <ProjectList 
              projects={filteredProjects.filter(p => p.status === 'active')} 
              isLoading={isLoading} 
            />
          </TabsContent>
          <TabsContent value="archived">
            <ProjectList 
              projects={filteredProjects.filter(p => p.status === 'archived')} 
              isLoading={isLoading} 
            />
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
