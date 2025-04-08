
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Cpu, Server, Cloud, Shield } from 'lucide-react';

interface SystemConfigStepProps {
  data: {
    name: string;
    description: string;
    type: string;
    language: string;
    templateId: string;
  };
  updateData: (data: Partial<SystemConfigStepProps['data']>) => void;
}

export function SystemConfigStep({ data, updateData }: SystemConfigStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">System Configuration</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Configure system settings for your educational project.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Cpu className="h-5 w-5 text-indigo-500" />
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Performance Settings</h3>
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="highPerformance" className="font-medium text-slate-700 dark:text-slate-300">
                    High Performance Mode
                  </Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Allocate more resources for faster processing
                  </p>
                </div>
                <Switch id="highPerformance" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="caching" className="font-medium text-slate-700 dark:text-slate-300">
                    Enable Caching
                  </Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Improve performance with content caching
                  </p>
                </div>
                <Switch id="caching" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-indigo-500" />
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Privacy & Permissions</h3>
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="contentFiltering" className="font-medium text-slate-700 dark:text-slate-300">
                    Content Filtering
                  </Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Apply age-appropriate content filters
                  </p>
                </div>
                <Switch id="contentFiltering" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dataCollection" className="font-medium text-slate-700 dark:text-slate-300">
                    Data Collection
                  </Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Collect usage data for improvements
                  </p>
                </div>
                <Switch id="dataCollection" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Server className="h-5 w-5 text-indigo-500" />
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Advanced Options</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <Label htmlFor="modelVersion" className="font-medium text-slate-700 dark:text-slate-300">
                AI Model Version
              </Label>
              <Select defaultValue="latest">
                <SelectTrigger id="modelVersion" className="border-slate-200 dark:border-slate-700 dark:bg-slate-800/50">
                  <SelectValue placeholder="Select model version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest (Recommended)</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="legacy">Legacy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region" className="font-medium text-slate-700 dark:text-slate-300">
                Processing Region
              </Label>
              <Select defaultValue="auto">
                <SelectTrigger id="region" className="border-slate-200 dark:border-slate-700 dark:bg-slate-800/50">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-select (Fastest)</SelectItem>
                  <SelectItem value="us">North America</SelectItem>
                  <SelectItem value="eu">Europe</SelectItem>
                  <SelectItem value="asia">Asia Pacific</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-3">
          <Settings className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-0.5" />
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              These system settings can be modified later from the project settings page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
