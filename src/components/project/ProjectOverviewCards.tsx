
import React from 'react';
import { BookText, FileText, Target, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';

export const ProjectOverviewCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Content Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold">3</div>
            <BookText className="h-5 w-5 text-slate-400" />
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-slate-500">
            Target: 12 items
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Word Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold">2,450</div>
            <FileText className="h-5 w-5 text-slate-400" />
          </div>
          <Progress value={49} className="h-1.5 mt-2" />
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-slate-500">
            49% of 5,000 word target
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold">5</div>
            <Target className="h-5 w-5 text-slate-400" />
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-slate-500">
            Files available for context
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Last Modified</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold">2h ago</div>
            <Clock className="h-5 w-5 text-slate-400" />
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-slate-500">
            Last content update at 2:45 PM
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
