
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProjectOutline } from '@/types/outline';
import { Download, FileJson, FileText } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface OutlineExportProps {
  outline: ProjectOutline;
}

export const OutlineExport: React.FC<OutlineExportProps> = ({ outline }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [exportFormat, setExportFormat] = useState<'json' | 'markdown' | 'text'>('markdown');
  
  const exportOutline = () => {
    let content = '';
    let filename = `${outline.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
    let mimeType = '';
    
    switch (exportFormat) {
      case 'json':
        content = JSON.stringify(outline, null, 2);
        filename += '.json';
        mimeType = 'application/json';
        break;
      case 'markdown':
        content = convertToMarkdown(outline);
        filename += '.md';
        mimeType = 'text/markdown';
        break;
      case 'text':
        content = convertToText(outline);
        filename += '.txt';
        mimeType = 'text/plain';
        break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const convertToMarkdown = (outline: ProjectOutline): string => {
    let md = `# ${outline.title}\n\n`;
    
    if (outline.description) {
      md += `${outline.description}\n\n`;
    }
    
    outline.sections.forEach((section, index) => {
      md += `## ${section.title}\n\n`;
      
      if (section.description) {
        md += `${section.description}\n\n`;
      }
      
      section.items.forEach((item, itemIndex) => {
        md += `### ${item.title}\n\n`;
        
        if (item.description) {
          md += `${item.description}\n\n`;
        }
        
        md += `Status: ${item.status.replace('_', ' ')}\n\n`;
      });
    });
    
    return md;
  };
  
  const convertToText = (outline: ProjectOutline): string => {
    let text = `${outline.title}\n${'='.repeat(outline.title.length)}\n\n`;
    
    if (outline.description) {
      text += `${outline.description}\n\n`;
    }
    
    outline.sections.forEach((section, index) => {
      text += `${section.title}\n${'-'.repeat(section.title.length)}\n\n`;
      
      if (section.description) {
        text += `${section.description}\n\n`;
      }
      
      section.items.forEach((item, itemIndex) => {
        text += `  ${itemIndex + 1}. ${item.title}\n`;
        
        if (item.description) {
          text += `     ${item.description}\n`;
        }
        
        text += `     Status: ${item.status.replace('_', ' ')}\n\n`;
      });
    });
    
    return text;
  };
  
  return (
    <div className="space-y-4 py-2">
      <p className="text-sm text-muted-foreground">
        Export your outline in different formats for use in other applications.
      </p>
      
      <div className="grid grid-cols-3 gap-4">
        <Button
          variant={exportFormat === 'markdown' ? 'default' : 'outline'}
          className="flex-col h-24 p-2"
          onClick={() => setExportFormat('markdown')}
        >
          <FileText size={24} className="mb-1" />
          <span>Markdown</span>
        </Button>
        <Button
          variant={exportFormat === 'json' ? 'default' : 'outline'}
          className="flex-col h-24 p-2"
          onClick={() => setExportFormat('json')}
        >
          <FileJson size={24} className="mb-1" />
          <span>JSON</span>
        </Button>
        <Button
          variant={exportFormat === 'text' ? 'default' : 'outline'}
          className="flex-col h-24 p-2"
          onClick={() => setExportFormat('text')}
        >
          <FileText size={24} className="mb-1" />
          <span>Plain Text</span>
        </Button>
      </div>
      
      <Button 
        className="w-full gap-2" 
        onClick={exportOutline}
      >
        <Download size={16} />
        Export Outline
      </Button>
    </div>
  );
};
