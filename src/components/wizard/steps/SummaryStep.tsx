
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConfigData } from '../types';
import { CalendarIcon, CheckCircleIcon, FileIcon, GlobeIcon, BookIcon, UserIcon } from 'lucide-react';

interface SummaryStepProps {
  data: ConfigData;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ data }) => {
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get template name based on quickStart selection
  const getTemplateName = () => {
    switch (data.quickStart) {
      case 'custom': return 'Custom Configuration';
      case 'template': return 'Template';
      case 'duplicate': return 'Duplicated Project';
      case 'primary-math': return 'Primary Mathematics';
      case 'secondary-science': return 'Secondary Science';
      case 'language-learning': return 'Language Learning';
      case 'teacher-guide': return 'Teacher Guide';
      default: return data.quickStart;
    }
  };

  return (
    <div className="space-y-6">
      {/* Project overview */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Project Overview</h3>
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Project Name</div>
                  <div className="text-lg font-semibold">{data.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Creation Date</div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-slate-500" />
                    <span>{formatDate(data.createdDate)}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Template Type</div>
                  <div className="flex items-center gap-2">
                    <BookIcon className="h-4 w-4 text-slate-500" />
                    <span>{getTemplateName()}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Project Type</div>
                  <div>{data.projectType === 'Custom' ? data.customProjectType : data.projectType}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Language</div>
                  <div className="flex items-center gap-2">
                    <GlobeIcon className="h-4 w-4 text-slate-500" />
                    <span>{data.targetLanguage}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Word Count Target</div>
                  <div>{data.wordCount.toLocaleString()} words</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configuration Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Configuration */}
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <h4 className="text-md font-medium mb-4 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-slate-500" />
                System Configuration
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Interface Language</div>
                  <div className="text-sm">{data.interfaceLanguage}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Experience Level</div>
                  <div className="text-sm">{data.experienceLevel}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Interaction Mode</div>
                  <div className="text-sm">{data.interactionMode}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Output Detail</div>
                  <div className="text-sm">{data.outputDetail}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">System Behavior</div>
                  <div className="text-sm">{data.systemBehavior}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Project Configuration */}
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <h4 className="text-md font-medium mb-4 flex items-center gap-2">
                <BookIcon className="h-5 w-5 text-slate-500" />
                Project Configuration
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Pedagogy</div>
                  <div className="text-sm">{data.pedagogy === 'Custom' ? data.customPedagogy : data.pedagogy}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Word Distribution</div>
                  <div className="text-sm capitalize">{data.wordDistribution}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Word Enforcement</div>
                  <div className="text-sm capitalize">{data.wordEnforcement}</div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-2">Subjects</div>
                <div className="flex flex-wrap gap-2">
                  {data.subjects && data.subjects.length > 0 ? (
                    data.subjects.map((subject, index) => (
                      <Badge key={index} variant="outline" className="bg-slate-50">
                        {subject}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">None selected</span>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-2">Educational Levels</div>
                <div className="flex flex-wrap gap-2">
                  {data.levels && data.levels.length > 0 ? (
                    data.levels.map((level, index) => (
                      <Badge key={index} variant="outline" className="bg-slate-50">
                        {level}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">None selected</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Language & Content Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Language & Content Details</h3>
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Target Language</div>
                  <div className="text-sm">{data.targetLanguage}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Goal</div>
                  <div className="text-sm">{data.goal}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Complexity</div>
                  <div className="text-sm">{data.complexity}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Cultural Integration</div>
                  <div className="text-sm">{data.culturalIntegration}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Terminology Style</div>
                  <div className="text-sm">{data.terminology}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Content Markers</div>
                  <div className="text-sm">{data.markers}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Structure</div>
                  <div className="text-sm">{data.structure}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Formatting</div>
                  <div className="text-sm">{data.formatting}</div>
                </div>
              </div>
            </div>
            
            {data.standards && data.standards.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-2">Educational Standards</div>
                <div className="flex flex-wrap gap-2">
                  {data.standards.map((standard, index) => (
                    <Badge key={index} variant="outline" className="bg-slate-50">
                      {standard}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {data.customStandards && data.customStandards.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-2">Custom Standards</div>
                <div className="flex flex-wrap gap-2">
                  {data.customStandards.map((standard, index) => (
                    <Badge key={index} variant="outline" className="bg-slate-50">
                      {standard}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Uploaded Documents */}
      {data.uploadedDocuments && data.uploadedDocuments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Reference Documents</h3>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <ul className="space-y-2">
                {data.uploadedDocuments.map((doc, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 text-slate-500" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Ready to Create */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 flex items-center gap-3">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
          <div>
            <h4 className="font-medium text-green-800">Ready to Create</h4>
            <p className="text-sm text-green-700">
              Your project configuration is complete. Click "Create Project" to continue.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
