
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload, Camera, Save, Download, ArrowRight } from 'lucide-react';
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
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        <CardDescription>Frequently used functions and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          <Button 
            variant="default" 
            className="justify-start h-auto py-3 px-4 bg-brand-500 hover:bg-brand-600 text-white"
            onClick={() => navigate('/projects/new')}
          >
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-brand-400 bg-opacity-30 flex items-center justify-center mr-3">
                  <PlusCircle className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Create New Project</div>
                  <div className="text-xs text-brand-100 mt-0.5">Start a new educational content project</div>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-brand-200 ml-2" />
            </div>
          </Button>
          
          {hasProjects && (
            <>
              <Button 
                variant="outline" 
                className="justify-start h-auto py-3 px-4 border-slate-200 hover:border-brand-200 hover:bg-brand-50"
                onClick={() => navigate('/projects/1/knowledge-base')}
              >
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                      <Upload className="h-5 w-5 text-brand-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-800">Upload Knowledge Base</div>
                      <div className="text-xs text-slate-500 mt-0.5">Add reference materials to your project</div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 ml-2" />
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-3 px-4 border-slate-200 hover:border-brand-200 hover:bg-brand-50"
                onClick={() => navigate('/projects/1/content/new')}
              >
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                      <Camera className="h-5 w-5 text-brand-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-800">Generate Content</div>
                      <div className="text-xs text-slate-500 mt-0.5">Create AI-assisted educational content</div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 ml-2" />
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-3 px-4 border-slate-200 hover:border-brand-200 hover:bg-brand-50"
                onClick={() => navigate('/projects/1/snapshots')}
              >
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                      <Save className="h-5 w-5 text-brand-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-800">Create Snapshot</div>
                      <div className="text-xs text-slate-500 mt-0.5">Save the current state of your project</div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 ml-2" />
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-3 px-4 border-slate-200 hover:border-brand-200 hover:bg-brand-50"
              >
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                      <Download className="h-5 w-5 text-brand-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-800">Export Project</div>
                      <div className="text-xs text-slate-500 mt-0.5">Download your content in various formats</div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 ml-2" />
                </div>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
