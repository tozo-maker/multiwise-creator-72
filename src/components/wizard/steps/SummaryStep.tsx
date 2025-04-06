
import React from 'react';
import { ConfigData } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Settings, 
  BookOpen, 
  Languages, 
  FileText, 
  Paperclip 
} from 'lucide-react';

interface SummaryStepProps {
  data: ConfigData;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 mb-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-medium">Ready to Create Your Project</h3>
        <p className="text-muted-foreground mt-1">
          Review your project configuration before creating
        </p>
      </div>
      
      {/* Quick Start Template (if applicable) */}
      {data.quickStart && data.quickStart !== 'custom' && (
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-brand-50 text-brand-600 p-2 rounded-full">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Template</h3>
              <p className="font-medium">
                {data.quickStart === 'primary-math' && 'Primary Mathematics'}
                {data.quickStart === 'secondary-science' && 'Secondary Science'}
                {data.quickStart === 'language-learning' && 'Language Learning'}
                {data.quickStart === 'teacher-guide' && 'Teacher Guide'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Info Section */}
      <SummarySection 
        title="Project Information" 
        icon={<FileText className="h-5 w-5" />}
        items={[
          { label: 'Project Name', value: data.name || 'Unnamed Project' }
        ]}
      />
      
      {/* System Config Section */}
      <SummarySection 
        title="System Configuration" 
        icon={<Settings className="h-5 w-5" />}
        items={[
          { label: 'Interface Language', value: data.interfaceLanguage },
          { label: 'Experience Level', value: data.experienceLevel },
          { label: 'Interaction Mode', value: data.interactionMode },
          { label: 'Output Detail', value: data.outputDetail },
          { label: 'System Behavior', value: data.systemBehavior }
        ]}
      />
      
      {/* Project Config Section */}
      <SummarySection 
        title="Project Configuration" 
        icon={<BookOpen className="h-5 w-5" />}
        items={[
          { 
            label: 'Project Type', 
            value: data.projectType === 'Custom' 
              ? `Custom: ${data.customProjectType}` 
              : data.projectType 
          },
          { 
            label: 'Subjects', 
            value: data.subjects.length > 0 
              ? data.subjects.join(', ') 
              : 'None specified',
            isList: data.subjects.length > 2
          },
          { 
            label: 'Educational Levels', 
            value: data.levels.length > 0 
              ? data.levels.join(', ') 
              : 'None specified',
            isList: data.levels.length > 2
          },
          { 
            label: 'Pedagogical Approach', 
            value: data.pedagogy === 'Custom' 
              ? `Custom: ${data.customPedagogy}` 
              : data.pedagogy 
          },
          { 
            label: 'Word Count', 
            value: `${data.wordCount.toLocaleString()} words (${data.wordDistribution || 'balanced'} distribution, ${data.wordEnforcement || 'flexible'} enforcement)` 
          }
        ]}
      />
      
      {/* Language Config Section */}
      <SummarySection 
        title="Language Configuration" 
        icon={<Languages className="h-5 w-5" />}
        items={[
          { label: 'Content Language', value: data.targetLanguage },
          { label: 'Language Goal', value: data.goal },
          { label: 'Complexity', value: data.complexity },
          { label: 'Cultural Integration', value: data.culturalIntegration },
          { label: 'Terminology Approach', value: data.terminology },
          { label: 'Level Markers', value: data.markers },
          { 
            label: 'Standards Alignment', 
            value: data.standards && data.standards.length > 0 
              ? data.standards.join(', ') 
              : 'None specified',
            isList: data.standards && data.standards.length > 2
          },
          { label: 'Content Structure', value: data.structure }
        ]}
      />
      
      {/* Document Section */}
      {data.uploadedDocuments.length > 0 && (
        <SummarySection 
          title="Reference Documents" 
          icon={<Paperclip className="h-5 w-5" />}
          items={[
            { 
              label: 'Uploaded Documents', 
              value: `${data.uploadedDocuments.length} documents uploaded`,
              documents: data.uploadedDocuments
            }
          ]}
        />
      )}
      
      <div className="text-center text-sm text-muted-foreground">
        <p>You can modify these settings later from your project workspace.</p>
      </div>
    </div>
  );
};

interface SummarySectionProps {
  title: string;
  icon: React.ReactNode;
  items: {
    label: string;
    value: string;
    isList?: boolean;
    documents?: { name: string; description: string; }[];
  }[];
}

const SummarySection: React.FC<SummarySectionProps> = ({ title, icon, items }) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3 pb-2 border-b">
          <div className="bg-slate-50 text-slate-600 p-2 rounded-full">
            {icon}
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        
        <div className="space-y-2 pt-1">
          {items.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between py-1 text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                {!item.isList && !item.documents && (
                  <span className="font-medium">{item.value}</span>
                )}
              </div>
              
              {item.isList && (
                <div className="flex flex-wrap gap-1 mt-1 mb-2">
                  {item.value.split(', ').map((value, idx) => (
                    <Badge key={idx} variant="outline" className="font-normal">{value}</Badge>
                  ))}
                </div>
              )}
              
              {item.documents && (
                <div className="space-y-2 mt-2 mb-1">
                  {item.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center text-sm bg-slate-50 p-2 rounded">
                      <Paperclip className="h-3 w-3 mr-2 text-slate-400" />
                      <span className="font-medium">{doc.name}</span>
                      {doc.description && (
                        <span className="ml-2 text-xs text-slate-500 truncate">- {doc.description}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
