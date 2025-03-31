
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectList } from '@/components/projects/ProjectList';
import { NewProjectButton } from '@/components/projects/NewProjectButton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Sample project data
const sampleProjects = [
  {
    id: '1',
    title: 'AP Spanish Curriculum',
    type: 'Textbook',
    subjects: ['Spanish', 'Language Arts'],
    levels: ['High School', 'AP'],
    lastModified: '2023-10-15T14:30:00Z',
    status: 'In Progress',
    progress: 75
  },
  {
    id: '2',
    title: 'Elementary Science',
    type: 'Lesson Plan',
    subjects: ['Science', 'Biology'],
    levels: ['Elementary', 'Grade 3-5'],
    lastModified: '2023-09-22T10:15:00Z',
    status: 'Completed',
    progress: 100
  },
  {
    id: '3',
    title: 'Algebra Fundamentals',
    type: 'Workbook',
    subjects: ['Mathematics', 'Algebra'],
    levels: ['Middle School', 'Grade 7-8'],
    lastModified: '2023-11-05T09:45:00Z',
    status: 'In Progress',
    progress: 40
  },
  {
    id: '4',
    title: 'World History Guide',
    type: 'Teacher Guide',
    subjects: ['History', 'Social Studies'],
    levels: ['High School'],
    lastModified: '2023-10-30T16:20:00Z',
    status: 'Draft',
    progress: 15
  }
];

export const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Filter projects based on search and filters
  const filteredProjects = sampleProjects.filter(project => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Type filter
    const matchesType = filterType === 'all' || project.type === filterType;
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Projects</h1>
            <p className="text-slate-500 mt-1">Manage and create educational content projects</p>
          </div>
          <NewProjectButton />
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Project Filters</CardTitle>
            <CardDescription>Find your projects quickly with filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search projects..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>{filterType === 'all' ? 'All Project Types' : filterType}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Project Types</SelectItem>
                  <SelectItem value="Textbook">Textbook</SelectItem>
                  <SelectItem value="Lesson Plan">Lesson Plan</SelectItem>
                  <SelectItem value="Workbook">Workbook</SelectItem>
                  <SelectItem value="Teacher Guide">Teacher Guide</SelectItem>
                  <SelectItem value="Assessment">Assessment</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>{filterStatus === 'all' ? 'All Statuses' : filterStatus}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {filteredProjects.length > 0 ? (
          <ProjectList projects={filteredProjects} />
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-lg border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No projects found</h3>
            <p className="text-slate-500 mt-2 mb-6">
              {searchQuery || filterType !== 'all' || filterStatus !== 'all' 
                ? "Try adjusting your search or filters" 
                : "Create your first project to get started"}
            </p>
            <NewProjectButton />
          </div>
        )}
      </div>
    </MainLayout>
  );
};
