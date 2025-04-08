
import React from 'react';
import { motion } from 'framer-motion';
import { ProjectCard, ProjectCardProps } from '../ProjectCard';

interface ProjectListContentProps {
  projects: ProjectCardProps[];
  containerVariants: any;
}

export const ProjectListContent: React.FC<ProjectListContentProps> = ({ 
  projects, 
  containerVariants 
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
};
