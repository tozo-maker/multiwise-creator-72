import React, { useEffect, useState } from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectList } from '@/components/projects/ProjectList';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/supabase-custom';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const addStatusIfMissing = (projects: any[]) => {
  return projects.map(project => ({
    ...project,
    status: project.status || 'active'
  }));
};

const ProjectsContent = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Fetching projects for user:', user.id);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching projects:', error);
          throw error;
        }
        
        console.log('Fetched projects:', data);
        
        if (!data || data.length === 0) {
          setProjects([]);
          setIsLoading(false);
          return;
        }
        
        const formattedProjects = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || undefined,
          type: item.type,
          targetLanguage: item.target_language,
          lastModified: new Date(item.updated_at).toLocaleDateString(),
          progress: item.progress,
          status: item.status as 'active' | 'archived' | 'completed'
        }));
        
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error fetching projects",
          description: "There was a problem loading your projects.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [user, toast]);

  const filteredProjects = addStatusIfMissing(projects);
  
  const handleCreateProject = () => {
    navigate('/projects/create');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-6">
        <ThemeCard className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">Projects</CardTitle>
            <CardDescription>
              View and manage all your educational content projects
            </CardDescription>
          </CardHeader>
        </ThemeCard>
        
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
            <ProjectList projects={filteredProjects.filter(p => p.status === 'active')} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="archived">
            <ProjectList projects={filteredProjects.filter(p => p.status === 'archived')} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

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
