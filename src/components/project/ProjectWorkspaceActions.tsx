
import React from 'react';
import { FileText, LineChart, CalendarClock, Sparkles } from 'lucide-react';

export const useProjectQuickActions = (projectId: string) => {
  // Quick actions for the project
  const quickActions = [
    { 
      title: "Create Content", 
      description: "Create new educational content", 
      icon: FileText,
      path: `/projects/${projectId}/content/new`,
      primary: true
    },
    { 
      title: "Run Analysis", 
      description: "Analyze your content", 
      icon: LineChart,
      path: `/projects/${projectId}/analysis` 
    },
    { 
      title: "Schedule Review", 
      description: "Set up a content review", 
      icon: CalendarClock,
      path: "#" 
    },
    { 
      title: "AI Enhancements", 
      description: "Get AI suggestions", 
      icon: Sparkles,
      path: `/projects/${projectId}/enhancements` 
    }
  ];

  return quickActions;
};
