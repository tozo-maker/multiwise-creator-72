
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SystemConfigTab } from '@/components/configuration/SystemConfigTab';
import { ProjectConfigTab } from '@/components/configuration/ProjectConfigTab';
import { LanguageContentTab } from '@/components/configuration/LanguageContentTab';
import { SaveConfigurationButton } from '@/components/configuration/SaveConfigurationButton';
import { ConfigData } from '@/components/wizard/types';
import { useTheme } from '@/contexts/ThemeContext';

interface ConfigurationCardProps {
  projectId: string;
  configData: ConfigData;
  updateConfigData: (data: Partial<ConfigData>) => void;
  onSave: () => void;
}

export const ConfigurationCard: React.FC<ConfigurationCardProps> = ({ 
  projectId, 
  configData, 
  updateConfigData,
  onSave
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('system');

  return (
    <Card className={isDark 
      ? 'bg-slate-800 border-slate-700' 
      : 'bg-white border-slate-200 shadow-sm'
    }>
      <CardHeader>
        <CardTitle className={`text-xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          Project Configuration
        </CardTitle>
        <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Edit your project settings and parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`p-1 w-fit ${
            isDark ? 'bg-slate-700' : 'bg-slate-200'
          }`}>
            <TabsTrigger 
              value="system" 
              className={`px-4 ${
                isDark 
                  ? 'data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white' 
                  : 'data-[state=active]:bg-white text-slate-700 data-[state=active]:text-slate-900'
              }`}
            >
              System
            </TabsTrigger>
            <TabsTrigger 
              value="project" 
              className={`px-4 ${
                isDark 
                  ? 'data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white' 
                  : 'data-[state=active]:bg-white text-slate-700 data-[state=active]:text-slate-900'
              }`}
            >
              Project
            </TabsTrigger>
            <TabsTrigger 
              value="language" 
              className={`px-4 ${
                isDark 
                  ? 'data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white' 
                  : 'data-[state=active]:bg-white text-slate-700 data-[state=active]:text-slate-900'
              }`}
            >
              Language & Content
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="system">
            <SystemConfigTab configData={configData} updateConfigData={updateConfigData} />
          </TabsContent>
          
          <TabsContent value="project">
            <ProjectConfigTab configData={configData} updateConfigData={updateConfigData} />
          </TabsContent>
          
          <TabsContent value="language">
            <LanguageContentTab configData={configData} updateConfigData={updateConfigData} />
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 flex justify-end">
          <SaveConfigurationButton 
            onSave={onSave} 
            projectId={projectId}
            configData={configData}
          />
        </div>
      </CardContent>
    </Card>
  );
};
