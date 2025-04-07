
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardWelcomeProps {
  userName: string;
  hasProjects: boolean;
  className?: string;
}

export const DashboardWelcome = ({ userName, hasProjects, className }: DashboardWelcomeProps) => {
  const navigate = useNavigate();
  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Card className={`border-brand-200 dark:border-brand-800/50 bg-gradient-to-br from-brand-50 to-slate-50 dark:from-brand-900/30 dark:to-slate-800/50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {timeOfDay()}, {userName || 'Teacher'}!
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {hasProjects 
                ? "Continue working on your educational content projects or start something new."
                : "Ready to create your first educational content project?"}
            </p>
            <div className="flex flex-wrap gap-3">
              {!hasProjects && (
                <Button 
                  className="gap-1"
                  onClick={() => navigate('/projects/new')}
                >
                  Create First Project
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              <Button variant="outline" className="gap-1 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                <Video className="h-4 w-4" />
                Watch Tutorial
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="/dashboard-illustration.svg" 
              alt="Dashboard illustration" 
              className="h-24 w-auto dark:opacity-80"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
