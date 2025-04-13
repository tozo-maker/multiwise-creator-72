
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { AnthropicService } from '@/services/AnthropicService';
import { useDashboard } from '@/contexts/DashboardContext';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export const PredictiveAnalytics = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { projects, projectStats } = useDashboard();
  const { toast } = useToast();
  
  const [predictiveData, setPredictiveData] = useState<Array<any>>([]);
  const [predictiveTrend, setPredictiveTrend] = useState<string | null>(null);
  const [predictiveInsight, setPredictiveInsight] = useState<string>('');
  const [timeframe, setTimeframe] = useState<string>('month');
  const [metric, setMetric] = useState<string>('completion');
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate predictive analytics data
  const generatePredictiveData = async () => {
    setIsLoading(true);
    try {
      // Use actual project data to inform predictions
      const projectCount = projects.length;
      const completedCount = projects.filter(p => p.status === 'completed').length;
      const avgProgress = projectStats.averageProgressRate;
      
      // Get AI to generate predictive insights
      if (projects.length > 0) {
        const prompt = `Based on the following data about educational content projects:
        - Total projects: ${projectCount}
        - Completed projects: ${completedCount}
        - Average progress rate: ${avgProgress}%
        - Content items: ${projectStats.contentCount}
        
        Generate a predictive forecast for the next ${timeframe} regarding ${metric === 'completion' ? 'project completion rate' : 'content quality score'}. 
        Format your response as a JSON array of 12 data points with 'date' and 'value' properties.`;
        
        try {
          const result = await AnthropicService.generateContent({
            prompt,
            projectId: projects[0].id,
            temperature: 0.2,
          });
          
          // Parse the JSON from the response
          const responseText = result.content;
          const jsonMatch = responseText.match(/\[[\s\S]*\]/);
          
          if (jsonMatch) {
            const parsedData = JSON.parse(jsonMatch[0]);
            setPredictiveData(parsedData);
            
            // Determine trend
            const startValue = parsedData[0].value;
            const endValue = parsedData[parsedData.length - 1].value;
            setPredictiveTrend(endValue > startValue ? 'up' : 'down');
            
            // Generate insight
            const insightPrompt = `Based on the predictive data for ${metric === 'completion' ? 'project completion rate' : 'content quality score'} 
            which shows a trend from ${startValue} to ${endValue} over the next ${timeframe}, 
            provide a brief, actionable insight for the content team in 1-2 sentences.`;
            
            const insightResult = await AnthropicService.generateContent({
              prompt: insightPrompt,
              projectId: projects[0].id,
              temperature: 0.3,
            });
            
            setPredictiveInsight(insightResult.content);
          } else {
            throw new Error('Could not parse predictive data');
          }
        } catch (error) {
          console.error('Error generating predictive analytics:', error);
          // Fallback to sample data if AI generation fails
          generateSampleData();
        }
      } else {
        // Use sample data if no projects exist
        generateSampleData();
      }
    } catch (error) {
      console.error('Error in predictive analytics:', error);
      toast({
        title: 'Prediction Error',
        description: 'Could not generate predictive analytics',
        variant: 'destructive'
      });
      generateSampleData();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate sample data for demonstration
  const generateSampleData = () => {
    const baseValue = metric === 'completion' ? 65 : 78;
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    
    const data = [];
    const labels = timeframe === 'month' 
      ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] 
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < labels.length; i++) {
      const change = trend === 'up' 
        ? baseValue + (i * (2 + Math.random() * 3))
        : baseValue - (i * (1 + Math.random() * 2));
      
      data.push({
        date: labels[i],
        value: Math.min(100, Math.max(0, change))
      });
    }
    
    setPredictiveData(data);
    setPredictiveTrend(trend);
    
    // Set sample insight
    const sampleInsights = [
      "Based on current trends, focusing on completing smaller projects first could significantly improve your overall completion rate.",
      "Content quality is projected to improve as teams gain expertise with the platform, consider sharing best practices across teams.",
      "The data suggests allocating more resources to project onboarding could accelerate completion rates in the coming weeks."
    ];
    
    setPredictiveInsight(sampleInsights[Math.floor(Math.random() * sampleInsights.length)]);
  };
  
  // Generate data on component mount
  useEffect(() => {
    generatePredictiveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe, metric]);
  
  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Predictive Analytics</CardTitle>
          <CardDescription>AI-powered forecast for your content projects</CardDescription>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="completion">Completion Rate</SelectItem>
                <SelectItem value="quality">Quality Score</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="month">Next Month</SelectItem>
                <SelectItem value="year">Next Year</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={generatePredictiveData}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <>
            <div className="mb-6">
              <Badge 
                variant={predictiveTrend === 'up' ? 'default' : 'destructive'}
                className="flex items-center gap-1 mb-2"
              >
                {predictiveTrend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {predictiveTrend === 'up' ? 'Positive Trend' : 'Negative Trend'}
              </Badge>
              
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-200 dark:border-amber-800">
                <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300">{predictiveInsight}</p>
              </div>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={predictiveData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="date" 
                    stroke={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <YAxis 
                    stroke={isDark ? '#9ca3af' : '#6b7280'}
                    domain={[0, 100]} 
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDark ? '#1f2937' : '#fff',
                      borderColor: isDark ? '#374151' : '#e5e7eb',
                      color: isDark ? '#fff' : '#000'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name={metric === 'completion' ? 'Predicted Completion Rate' : 'Predicted Quality Score'}
                    stroke={metric === 'completion' ? '#3b82f6' : '#10b981'} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
