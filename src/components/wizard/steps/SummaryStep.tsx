
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  BookOpen, 
  Languages, 
  FileText, 
  Check,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SummaryStepProps {
  data: {
    name: string;
    quickStart: string;
    // System Config
    interfaceLanguage: string;
    experienceLevel: string;
    interactionMode: string;
    outputDetail: string;
    systemBehavior: string;
    // Project Config
    projectType: string;
    subjects: string[];
    levels: string[];
    pedagogy: string;
    wordCount: number;
    // Language Config
    targetLanguage: string;
    goal: string;
    complexity: string;
    culturalIntegration: string;
    terminology: string;
    markers: string;
    standards: string;
    structure: string;
    formatting: string;
    // Documents
    uploadedDocuments: { name: string; description: string; }[];
  };
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="bg-brand-50 border border-brand-100 rounded-lg p-4 text-brand-800">
        <div className="flex items-start space-x-3">
          <Check className="h-5 w-5 mt-0.5 text-brand-600" />
          <div>
            <h3 className="font-medium">Ready to Create Your Project</h3>
            <p className="text-sm mt-1">
              Review your configuration below. You can always modify these settings later.
            </p>
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-5">
          <div className="space-y-1">
            <h3 className="font-semibold text-xl">{data.name}</h3>
            <p className="text-sm text-slate-500">
              {data.quickStart === 'custom' ? 'Custom Configuration' : 
                data.quickStart === 'template' ? 'Template-based' : 'Duplicated Project'}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <SummarySection 
          title="System Configuration" 
          icon={<Settings className="h-5 w-5" />}
        >
          <SummaryItem label="Interface Language" value={data.interfaceLanguage} />
          <SummaryItem label="Experience Level" value={data.experienceLevel} />
          <SummaryItem label="Interaction Mode" value={data.interactionMode} />
          <SummaryItem label="Output Detail" value={data.outputDetail} />
          <SummaryItem label="System Behavior" value={data.systemBehavior} />
        </SummarySection>
        
        <SummarySection 
          title="Project Configuration" 
          icon={<BookOpen className="h-5 w-5" />}
        >
          <SummaryItem label="Project Type" value={data.projectType} />
          <SummaryItem 
            label="Subjects" 
            value={
              data.subjects.length > 0 
                ? <div className="flex flex-wrap gap-1">
                    {data.subjects.map((subject, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{subject}</Badge>
                    ))}
                  </div>
                : "None specified"
            } 
          />
          <SummaryItem 
            label="Educational Levels" 
            value={
              data.levels.length > 0 
                ? <div className="flex flex-wrap gap-1">
                    {data.levels.map((level, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{level}</Badge>
                    ))}
                  </div>
                : "None specified"
            } 
          />
          <SummaryItem label="Pedagogical Approach" value={data.pedagogy} />
          <SummaryItem label="Target Word Count" value={data.wordCount.toLocaleString()} />
        </SummarySection>
        
        <SummarySection 
          title="Language & Content Configuration" 
          icon={<Languages className="h-5 w-5" />}
        >
          <SummaryItem label="Target Language" value={data.targetLanguage} />
          <SummaryItem label="Primary Goal" value={data.goal} />
          <SummaryItem label="Language Complexity" value={data.complexity} />
          <SummaryItem label="Cultural Integration" value={data.culturalIntegration} />
          <SummaryItem label="Educational Standards" value={data.standards} />
          <SummaryItem label="Formatting Style" value={data.formatting} />
        </SummarySection>
        
        {data.uploadedDocuments.length > 0 && (
          <SummarySection 
            title="Uploaded Documents" 
            icon={<FileText className="h-5 w-5" />}
          >
            {data.uploadedDocuments.map((doc, i) => (
              <SummaryItem 
                key={i}
                label={doc.name} 
                value={doc.description || "No description"} 
              />
            ))}
          </SummarySection>
        )}
      </div>
    </div>
  );
};

interface SummarySectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SummarySection: React.FC<SummarySectionProps> = ({ title, icon, children }) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 flex items-center space-x-3 bg-slate-50 border-b border-slate-200">
          <span className="text-slate-600">{icon}</span>
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

interface SummaryItemProps {
  label: string;
  value: React.ReactNode;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value }) => {
  return (
    <div className="px-4 py-3 flex justify-between items-center">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
};
