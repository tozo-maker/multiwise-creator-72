
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { Separator } from '@/components/ui/separator';

export const ProjectComparisonTool = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { projects } = useDashboard();
  
  const [project1, setProject1] = useState(projects[0]?.id || '');
  const [project2, setProject2] = useState(projects.length > 1 ? projects[1]?.id || '' : '');
  
  // Get project by ID
  const getProjectById = (id: string) => {
    return projects.find(p => p.id === id);
  };
  
  // Generate comparison data
  const generateComparisonData = () => {
    const p1 = getProjectById(project1);
    const p2 = getProjectById(project2);
    
    if (!p1) return [];
    
    // Base metrics for first project
    const metrics = [
      { 
        attribute: 'Progress', 
        Project1: p1.progress, 
        Project2: p2 ? p2.progress : 0 
      },
      { 
        attribute: 'Content Quality', 
        Project1: 65 + Math.floor(Math.random() * 25), 
        Project2: p2 ? 65 + Math.floor(Math.random() * 25) : 0 
      },
      { 
        attribute: 'Engagement', 
        Project1: 65 + Math.floor(Math.random() * 25), 
        Project2: p2 ? 65 + Math.floor(Math.random() * 25) : 0 
      },
      { 
        attribute: 'Alignment', 
        Project1: 65 + Math.floor(Math.random() * 25), 
        Project2: p2 ? 65 + Math.floor(Math.random() * 25) : 0 
      },
      { 
        attribute: 'Efficiency', 
        Project1: 65 + Math.floor(Math.random() * 25), 
        Project2: p2 ? 65 + Math.floor(Math.random() * 25) : 0 
      }
    ];
    
    return metrics;
  };
  
  const comparisonData = generateComparisonData();
  
  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle>Project Comparison</CardTitle>
        <CardDescription>Compare key metrics across projects</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Project 1</label>
            <Select value={project1} onValueChange={setProject1}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Project 2</label>
            <Select value={project2} onValueChange={setProject2}>
              <SelectTrigger>
                <SelectValue placeholder="Select project to compare" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="">None (Baseline Comparison)</SelectItem>
                  {projects.map(project => (
                    project.id !== project1 && (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    )
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Separator className="mb-4" />
        
        <div className="h-[400px]">
          {comparisonData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={comparisonData}>
                <PolarGrid stroke={isDark ? '#374151' : '#e5e7eb'} />
                <PolarAngleAxis dataKey="attribute" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar 
                  name={getProjectById(project1)?.name || 'Project 1'} 
                  dataKey="Project1" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6} 
                />
                {project2 && (
                  <Radar 
                    name={getProjectById(project2)?.name || 'Project 2'} 
                    dataKey="Project2" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6} 
                  />
                )}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
        
        <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          <p>This comparison shows relative performance across key project metrics on a scale of 0-100.</p>
        </div>
      </CardContent>
    </Card>
  );
};
