
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Plus, X, Save } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDashboard } from '@/contexts/DashboardContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';

interface ReportMetric {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}

export const CustomReportBuilder = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { projects } = useDashboard();
  const { toast } = useToast();
  
  const [reportTab, setReportTab] = useState('builder');
  const [reportName, setReportName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('last30days');
  const [metrics, setMetrics] = useState<ReportMetric[]>([
    { id: 'progress', name: 'Project Progress', category: 'project', selected: true },
    { id: 'quality', name: 'Content Quality Score', category: 'content', selected: true },
    { id: 'completion', name: 'Completion Rate', category: 'project', selected: true },
    { id: 'readability', name: 'Readability Score', category: 'content', selected: false },
    { id: 'engagement', name: 'User Engagement', category: 'content', selected: false },
    { id: 'alignment', name: 'Learning Alignment', category: 'content', selected: false },
    { id: 'accessibility', name: 'Accessibility Score', category: 'content', selected: false },
    { id: 'efficiency', name: 'Development Efficiency', category: 'project', selected: false },
  ]);
  const [savedReports, setSavedReports] = useState([
    { id: '1', name: 'Monthly Progress Report', date: '2025-04-08', metrics: 4 },
    { id: '2', name: 'Content Quality Assessment', date: '2025-04-05', metrics: 6 },
  ]);
  
  // Toggle metric selection
  const toggleMetric = (id: string) => {
    setMetrics(metrics.map(metric => 
      metric.id === id ? { ...metric, selected: !metric.selected } : metric
    ));
  };
  
  // Toggle project selection
  const toggleProject = (id: string) => {
    setSelectedProjects(
      selectedProjects.includes(id) 
        ? selectedProjects.filter(p => p !== id)
        : [...selectedProjects, id]
    );
  };
  
  // Generate report preview
  const generateReport = () => {
    if (!reportName) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a report name',
        variant: 'destructive'
      });
      return;
    }
    
    if (selectedProjects.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please select at least one project',
        variant: 'destructive'
      });
      return;
    }
    
    if (metrics.filter(m => m.selected).length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please select at least one metric',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Report Generated',
      description: 'Your custom report has been created',
    });
    
    setReportTab('preview');
  };
  
  // Save report template
  const saveReport = () => {
    if (!reportName) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a report name',
        variant: 'destructive'
      });
      return;
    }
    
    // Add to saved reports
    const newReport = {
      id: Date.now().toString(),
      name: reportName,
      date: new Date().toISOString().split('T')[0],
      metrics: metrics.filter(m => m.selected).length
    };
    
    setSavedReports([...savedReports, newReport]);
    
    toast({
      title: 'Report Saved',
      description: 'Your report template has been saved',
    });
  };
  
  // Export report
  const exportReport = () => {
    toast({
      title: 'Report Exported',
      description: 'Your report has been exported to PDF',
    });
  };
  
  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle>Custom Report Builder</CardTitle>
        <CardDescription>Create detailed reports for your content projects</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={reportTab} onValueChange={setReportTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="saved">Saved Reports</TabsTrigger>
            <TabsTrigger value="builder">Report Builder</TabsTrigger>
            <TabsTrigger value="preview">Preview Report</TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved">
            <div className="space-y-4">
              {savedReports.length > 0 ? (
                <>
                  {savedReports.map(report => (
                    <div 
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-slate-400" />
                        <div>
                          <h3 className="font-medium">{report.name}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Last generated: {report.date} • {report.metrics} metrics
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setReportName(report.name);
                          setReportTab('builder');
                        }}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={exportReport}>
                          <Download size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <FileText size={40} className="mx-auto mb-2 text-slate-400" />
                  <h3 className="text-lg font-medium mb-1">No saved reports</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">Create custom reports to save them here</p>
                  <Button onClick={() => setReportTab('builder')}>
                    Create Report
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="builder">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-medium">Report Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input 
                      id="report-name"
                      placeholder="Monthly Progress Report"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger id="date-range">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="last7days">Last 7 Days</SelectItem>
                          <SelectItem value="last30days">Last 30 Days</SelectItem>
                          <SelectItem value="last90days">Last 90 Days</SelectItem>
                          <SelectItem value="alltime">All Time</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description"
                    placeholder="Describe the purpose of this report..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="font-medium">Select Projects</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {projects.length > 0 ? (
                    projects.map(project => (
                      <div key={project.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`project-${project.id}`}
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={() => toggleProject(project.id)}
                        />
                        <label
                          htmlFor={`project-${project.id}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {project.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No projects available. Create projects to include them in reports.
                    </p>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="font-medium">Select Metrics</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {metrics.map(metric => (
                    <div key={metric.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`metric-${metric.id}`}
                        checked={metric.selected}
                        onCheckedChange={() => toggleMetric(metric.id)}
                      />
                      <label
                        htmlFor={`metric-${metric.id}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {metric.name}
                        <span className="ml-1 text-xs text-slate-500">({metric.category})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{reportName || 'Custom Report'}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Generated: {new Date().toLocaleDateString()}
                </p>
              </div>
              
              {description && (
                <p className="text-sm italic text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              )}
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Projects Included:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {selectedProjects.map(id => {
                    const project = projects.find(p => p.id === id);
                    return project ? (
                      <li key={id}>
                        {project.name} <span className="text-slate-500">({project.type || 'No type'})</span>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Metrics Overview:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {metrics.filter(m => m.selected).map(metric => (
                    <Card key={metric.id} className="bg-slate-50 dark:bg-slate-800/50">
                      <CardContent className="pt-4">
                        <h4 className="font-medium text-sm mb-2">{metric.name}</h4>
                        <div className="h-40 flex items-center justify-center bg-slate-100 dark:bg-slate-700/50 rounded-md border border-dashed">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Chart or data visualization will appear here
                          </p>
                        </div>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          {metric.category === 'project' 
                            ? 'Project-level metric across selected timeframe'
                            : 'Content-level metric aggregated by project'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {reportTab === 'builder' && (
          <>
            <Button variant="outline" onClick={() => setReportTab('saved')}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={saveReport} className="gap-1">
                <Save size={14} />
                Save Template
              </Button>
              <Button onClick={generateReport}>Generate Report</Button>
            </div>
          </>
        )}
        
        {reportTab === 'preview' && (
          <>
            <Button variant="outline" onClick={() => setReportTab('builder')}>
              Back to Editor
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={saveReport} className="gap-1">
                <Save size={14} />
                Save Template
              </Button>
              <Button onClick={exportReport} className="gap-1">
                <Download size={14} />
                Export PDF
              </Button>
            </div>
          </>
        )}
        
        {reportTab === 'saved' && (
          <>
            <div></div>
            <Button onClick={() => setReportTab('builder')} className="gap-1">
              <Plus size={14} />
              New Report
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CustomReportBuilder;
