
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload, Camera, Save, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardQuickActionsProps {
  hasProjects: boolean;
  className?: string;
}

export const DashboardQuickActions = ({ hasProjects, className }: DashboardQuickActionsProps) => {
  const navigate = useNavigate();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Frequently used functions and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          <Button 
            variant="outline" 
            className="justify-start h-auto py-3 px-4"
            onClick={() => navigate('/projects/new')}
          >
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                <PlusCircle className="h-4 w-4 text-brand-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">Create New Project</div>
                <div className="text-xs text-slate-500 mt-0.5">Start a new educational content project</div>
              </div>
            </div>
          </Button>
          
          {hasProjects && (
            <>
              <Button 
                variant="outline" 
                className="justify-start h-auto py-3 px-4"
                onClick={() => navigate('/projects/1/knowledge-base')}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                    <Upload className="h-4 w-4 text-brand-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Upload Knowledge Base</div>
                    <div className="text-xs text-slate-500 mt-0.5">Add reference materials to your project</div>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-3 px-4"
                onClick={() => navigate('/projects/1/content/new')}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                    <Camera className="h-4 w-4 text-brand-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Generate Content</div>
                    <div className="text-xs text-slate-500 mt-0.5">Create AI-assisted educational content</div>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-3 px-4"
                onClick={() => navigate('/projects/1/snapshots')}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                    <Save className="h-4 w-4 text-brand-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Create Snapshot</div>
                    <div className="text-xs text-slate-500 mt-0.5">Save the current state of your project</div>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-3 px-4"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                    <Download className="h-4 w-4 text-brand-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Export Project</div>
                    <div className="text-xs text-slate-500 mt-0.5">Download your content in various formats</div>
                  </div>
                </div>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
