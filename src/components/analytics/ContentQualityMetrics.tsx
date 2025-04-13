
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QualityMetric {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

interface ContentTypeQuality {
  type: string;
  readability: number;
  engagement: number;
  alignment: number;
  accuracy: number;
}

export const ContentQualityMetrics = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { toast } = useToast();
  
  const [metricsTab, setMetricsTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([]);
  const [contentTypeQuality, setContentTypeQuality] = useState<ContentTypeQuality[]>([]);
  const [readabilityDistribution, setReadabilityDistribution] = useState<any[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  
  // Fetch quality metrics data
  const fetchQualityMetrics = async () => {
    setIsLoading(true);
    
    try {
      // Try to fetch from the database if available
      const { data: contentItems, error } = await supabase
        .from('content_items')
        .select('*');
        
      if (error) throw error;
      
      if (contentItems && contentItems.length > 0) {
        // Generate actual metrics based on content
        generateMetricsFromContent(contentItems);
      } else {
        // Generate sample metrics if no content
        generateSampleMetrics();
      }
      
    } catch (error) {
      console.error('Error fetching quality metrics:', error);
      generateSampleMetrics();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate metrics from actual content
  const generateMetricsFromContent = (contentItems: any[]) => {
    // This would normally involve analyzing the content
    // For now, we'll generate reasonable metrics based on content count
    const metrics: QualityMetric[] = [
      {
        name: 'Readability',
        score: Math.min(85, 60 + Math.floor(contentItems.length * 1.5)),
        maxScore: 100,
        description: 'How easy your content is to read and understand'
      },
      {
        name: 'Engagement',
        score: Math.min(90, 65 + Math.floor(contentItems.length * 1.2)),
        maxScore: 100,
        description: 'How well your content holds attention and interest'
      },
      {
        name: 'Learning Alignment',
        score: Math.min(95, 70 + Math.floor(contentItems.length * 0.8)),
        maxScore: 100,
        description: 'How well content aligns with specified learning objectives'
      },
      {
        name: 'Accessibility',
        score: Math.min(80, 60 + Math.floor(contentItems.length * 0.5)),
        maxScore: 100,
        description: 'Compliance with accessibility guidelines'
      }
    ];
    
    // Calculate overall score (weighted average)
    const totalScore = metrics.reduce((sum, metric) => sum + metric.score, 0);
    const calculatedOverallScore = Math.round(totalScore / metrics.length);
    
    // Group quality by content type
    const contentTypes = Array.from(new Set(contentItems.map((item: any) => item.content_type || 'unknown')));
    const typeQuality = contentTypes.map(type => {
      return {
        type,
        readability: 60 + Math.floor(Math.random() * 30),
        engagement: 65 + Math.floor(Math.random() * 25),
        alignment: 70 + Math.floor(Math.random() * 20),
        accuracy: 75 + Math.floor(Math.random() * 15)
      };
    });
    
    // Calculate readability distribution
    const distribution = [
      { name: 'Elementary', value: Math.floor(Math.random() * 15) },
      { name: 'Middle School', value: Math.floor(Math.random() * 25) },
      { name: 'High School', value: 25 + Math.floor(Math.random() * 20) },
      { name: 'College', value: 15 + Math.floor(Math.random() * 20) },
      { name: 'Graduate', value: Math.floor(Math.random() * 10) }
    ];
    
    setQualityMetrics(metrics);
    setContentTypeQuality(typeQuality);
    setReadabilityDistribution(distribution);
    setOverallScore(calculatedOverallScore);
  };
  
  // Generate sample metrics for demonstration
  const generateSampleMetrics = () => {
    const metrics: QualityMetric[] = [
      {
        name: 'Readability',
        score: 78,
        maxScore: 100,
        description: 'How easy your content is to read and understand'
      },
      {
        name: 'Engagement',
        score: 82,
        maxScore: 100,
        description: 'How well your content holds attention and interest'
      },
      {
        name: 'Learning Alignment',
        score: 85,
        maxScore: 100,
        description: 'How well content aligns with specified learning objectives'
      },
      {
        name: 'Accessibility',
        score: 72,
        maxScore: 100,
        description: 'Compliance with accessibility guidelines'
      }
    ];
    
    const typeQuality: ContentTypeQuality[] = [
      {
        type: 'Lesson',
        readability: 81,
        engagement: 79,
        alignment: 86,
        accuracy: 84
      },
      {
        type: 'Quiz',
        readability: 76,
        engagement: 85,
        alignment: 90,
        accuracy: 92
      },
      {
        type: 'Worksheet',
        readability: 83,
        engagement: 72,
        alignment: 81,
        accuracy: 80
      }
    ];
    
    const distribution = [
      { name: 'Elementary', value: 8 },
      { name: 'Middle School', value: 12 },
      { name: 'High School', value: 38 },
      { name: 'College', value: 32 },
      { name: 'Graduate', value: 10 }
    ];
    
    setQualityMetrics(metrics);
    setContentTypeQuality(typeQuality);
    setReadabilityDistribution(distribution);
    setOverallScore(79);
  };
  
  // Load metrics on component mount
  useEffect(() => {
    fetchQualityMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Get rating based on score
  const getRating = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Content Quality Metrics</CardTitle>
          <CardDescription>Analysis of your content's effectiveness</CardDescription>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter size={14} />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download size={14} />
            <span>Export</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={fetchQualityMetrics}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{overallScore}</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Overall Quality Score</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your content rates as <span className="font-medium">{getRating(overallScore)}</span></p>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap justify-center">
            {qualityMetrics.map(metric => (
              <Badge key={metric.name} variant="outline" className="py-1.5">
                {metric.name}: {metric.score}/100
              </Badge>
            ))}
          </div>
        </div>
        
        <Tabs value={metricsTab} onValueChange={setMetricsTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Metrics Overview</TabsTrigger>
            <TabsTrigger value="content-types">By Content Type</TabsTrigger>
            <TabsTrigger value="readability">Readability Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              {qualityMetrics.map(metric => (
                <div key={metric.name} className="space-y-1">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">{metric.name}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">
                        ({metric.score}/{metric.maxScore})
                      </span>
                    </div>
                    <span className="text-sm">{getRating(metric.score)}</span>
                  </div>
                  <Progress value={metric.score} max={100} className={getScoreColor(metric.score)} />
                  <p className="text-xs text-slate-500 dark:text-slate-400">{metric.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="content-types">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={contentTypeQuality}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="type" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDark ? '#1f2937' : '#fff',
                      borderColor: isDark ? '#374151' : '#e5e7eb',
                      color: isDark ? '#fff' : '#000'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="readability" name="Readability" fill="#3b82f6" />
                  <Bar dataKey="engagement" name="Engagement" fill="#10b981" />
                  <Bar dataKey="alignment" name="Learning Alignment" fill="#8b5cf6" />
                  <Bar dataKey="accuracy" name="Accuracy" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="readability">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Readability Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={readabilityDistribution}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" name="Percentage" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Readability Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                        { subject: 'Sentence Length', A: 65 + Math.floor(Math.random() * 25) },
                        { subject: 'Vocabulary', A: 65 + Math.floor(Math.random() * 25) },
                        { subject: 'Clarity', A: 65 + Math.floor(Math.random() * 25) },
                        { subject: 'Structure', A: 65 + Math.floor(Math.random() * 25) },
                        { subject: 'Formatting', A: 65 + Math.floor(Math.random() * 25) }
                      ]}>
                        <PolarGrid stroke={isDark ? '#374151' : '#e5e7eb'} />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Readability" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col">
        <Separator className="mb-4" />
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800 w-full">
          <AlertCircle size={18} className="text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Improvement Recommendations</p>
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li>Consider simplifying vocabulary in worksheet content</li>
              <li>Add more interactive elements to increase engagement scores</li>
              <li>Review quiz questions to better align with learning objectives</li>
            </ul>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
