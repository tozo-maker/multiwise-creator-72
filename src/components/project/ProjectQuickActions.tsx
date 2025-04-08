
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  primary?: boolean;
}

interface ProjectQuickActionsProps {
  projectId: string;
  quickActions: QuickAction[];
}

export const ProjectQuickActions: React.FC<ProjectQuickActionsProps> = ({ 
  projectId, 
  quickActions 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div>
      <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className={`${
              isDark 
                ? 'bg-slate-800 border-slate-700 hover:border-slate-600' 
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            } transition-all overflow-hidden ${
              action.primary 
                ? isDark 
                  ? 'border-l-4 border-l-indigo-500' 
                  : 'border-l-4 border-l-brand-500'
                : ''
            }`}
          >
            <CardHeader className="p-4 pb-0">
              <div className="flex items-start">
                <div className={`p-2 rounded-md mr-3 ${
                  action.primary 
                    ? isDark 
                      ? 'bg-indigo-950/60 text-indigo-400' 
                      : 'bg-brand-50 text-brand-600'
                    : isDark 
                      ? 'bg-slate-700 text-slate-400' 
                      : 'bg-slate-100 text-slate-500'
                }`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <CardTitle className={`text-base ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{action.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{action.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                asChild
                variant={action.primary ? "default" : "outline"}
                className={`w-full justify-between ${
                  action.primary 
                    ? isDark 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-brand-600 hover:bg-brand-700 text-white'
                    : isDark 
                      ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 text-slate-300' 
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Link to={action.path}>
                  <span>Get Started</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
