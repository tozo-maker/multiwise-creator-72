
import React from 'react';
import { ProjectCard, ProjectCardProps } from './ProjectCard';
import { NewProjectButton } from './NewProjectButton';

interface ProjectListProps {
  projects: ProjectCardProps[];
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  // Show 6 projects if available, or show "No projects" state
  const displayProjects = projects.slice(0, 6);
  
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-slate-100">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-8 h-8 text-slate-400"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">No projects yet</h3>
        <p className="text-slate-500 mb-4">Get started by creating your first educational project</p>
        <div className="flex justify-center">
          <NewProjectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {displayProjects.map(project => (
        <ProjectCard key={project.id} {...project} />
      ))}
      
      {projects.length > 6 && (
        <div className="col-span-full mt-4 text-center">
          <Button 
            variant="outline" 
            className="border-dashed border-slate-300"
            onClick={() => window.location.href = '/projects'}
          >
            View all {projects.length} projects
          </Button>
        </div>
      )}
    </div>
  );
};
