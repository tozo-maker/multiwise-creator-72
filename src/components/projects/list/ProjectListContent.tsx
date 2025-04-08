
import React from 'react';
import { motion } from 'framer-motion';
import { ProjectCard, ProjectCardProps } from '../ProjectCard';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectListContentProps {
  projects: ProjectCardProps[];
  containerVariants: any;
}

export const ProjectListContent: React.FC<ProjectListContentProps> = React.memo(({ 
  projects, 
  containerVariants 
}) => {
  const { isDark } = useTheme();
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {projects.map(project => (
        <motion.div key={project.id} variants={itemVariants}>
          <ProjectCard {...project} />
        </motion.div>
      ))}
    </motion.div>
  );
});

ProjectListContent.displayName = 'ProjectListContent';
