
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';

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
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className={`border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow overflow-hidden ${
              action.primary ? 'border-l-4 border-l-brand-500' : ''
            }`}
          >
            <CardHeader className="p-4 pb-0">
              <div className="flex items-start">
                <div className={`p-2 rounded-md mr-3 ${
                  action.primary ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">{action.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">{action.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                asChild
                variant={action.primary ? "default" : "outline"}
                className={`w-full justify-between ${
                  action.primary ? 'bg-brand-500 hover:bg-brand-600 text-white' : ''
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
