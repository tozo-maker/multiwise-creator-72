import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Project } from '@/types/supabase-custom';

export type ProjectCardProps = Project;

interface ProjectCardComponentProps extends ProjectCardProps {
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardComponentProps> = ({
  id,
  name,
  type,
  targetLanguage,
  progress,
  lastModified,
  className,
  status = 'active'
}) => {
  const statusColors = {
    active: 'text-green-500',
    archived: 'text-gray-500',
    completed: 'text-blue-500',
  };

  return (
    <Card className={`hover:shadow-md transition-all ${className}`}>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <Link to={`/projects/${id}`} className="font-semibold hover:underline">{name}</Link>
          <span className={`text-xs font-medium ${statusColors[status || 'active']}`}>{status}</span>
        </div>
        <p className="text-sm text-gray-500">Type: {type}</p>
        <p className="text-sm text-gray-500">Language: {targetLanguage}</p>
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress: {progress}%</span>
          <span>Last Modified: {lastModified}</span>
        </div>
      </CardContent>
    </Card>
  );
};
