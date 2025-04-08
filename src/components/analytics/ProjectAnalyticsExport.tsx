
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, BarChart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

interface ProjectAnalyticsExportProps {
  projectId?: string;
}

export const ProjectAnalyticsExport: React.FC<ProjectAnalyticsExportProps> = ({ projectId }) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  
  const handleExport = (format: 'csv' | 'pdf' | 'json') => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      
      toast({
        title: "Export complete",
        description: `Your analytics have been exported as ${format.toUpperCase()}`,
      });
      
      // In a real implementation, this would trigger a download
      // For now we'll just simulate it with console
      console.log(`Exporting analytics for project ${projectId || 'all'} in ${format} format`);
    }, 1500);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            Analytics Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="data">
            <TabsList className="mb-4">
              <TabsTrigger value="data">Data Export</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            
            <TabsContent value="data" className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Export your project analytics in various formats for further analysis.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2" 
                  disabled={isExporting}
                  onClick={() => handleExport('csv')}
                >
                  <Download className="h-4 w-4" />
                  CSV
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2" 
                  disabled={isExporting}
                  onClick={() => handleExport('pdf')}
                >
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2" 
                  disabled={isExporting}
                  onClick={() => handleExport('json')}
                >
                  <Download className="h-4 w-4" />
                  JSON
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Export pre-configured reports for your project.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-md dark:border-slate-700">
                  <div>
                    <h4 className="font-medium dark:text-white">Monthly Summary</h4>
                    <p className="text-sm text-muted-foreground">Project performance and engagement</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={isExporting}
                    onClick={() => handleExport('pdf')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md dark:border-slate-700">
                  <div>
                    <h4 className="font-medium dark:text-white">Content Analysis</h4>
                    <p className="text-sm text-muted-foreground">Content performance and engagement</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={isExporting}
                    onClick={() => handleExport('pdf')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Create and export custom analytics reports.
              </p>
              
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  Custom export functionality coming soon.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
