
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useTheme } from '@/contexts/ThemeContext';
import { FileDown, FileText, FileArchive, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ContentExportProps {
  content: string;
  title: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export const ContentExport: React.FC<ContentExportProps> = ({
  content,
  title,
  tags = [],
  metadata
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [exportFormat, setExportFormat] = useState('markdown');
  const [includeMetadata, setIncludeMetadata] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let exportContent = content;
      let fileExtension = 'md';
      let mimeType = 'text/markdown';
      
      // Add metadata if requested
      if (includeMetadata) {
        const metadataContent = JSON.stringify({
          title,
          tags,
          ...metadata
        }, null, 2);
        
        exportContent = `---\n${metadataContent}\n---\n\n${content}`;
      }
      
      // Format content based on selected format
      switch (exportFormat) {
        case 'html':
          exportContent = convertMarkdownToHtml(exportContent);
          fileExtension = 'html';
          mimeType = 'text/html';
          break;
        case 'text':
          exportContent = convertMarkdownToPlainText(exportContent);
          fileExtension = 'txt';
          mimeType = 'text/plain';
          break;
        case 'json':
          exportContent = JSON.stringify({
            title,
            content,
            tags,
            metadata
          }, null, 2);
          fileExtension = 'json';
          mimeType = 'application/json';
          break;
      }
      
      // Create file for download
      const blob = new Blob([exportContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export Successful',
        description: `Content exported as ${exportFormat.toUpperCase()}`
      });
    } catch (error) {
      console.error('Error during export:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export content',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const convertMarkdownToHtml = (markdown: string) => {
    // Basic markdown to HTML conversion
    let html = markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\_(.*?)\_/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br />');
      
    return `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1>${title}</h1>
  ${html}
</body>
</html>`;
  };
  
  const convertMarkdownToPlainText = (markdown: string) => {
    // Strip markdown syntax for plain text
    return markdown
      .replace(/^### (.*$)/gim, '$1\n')
      .replace(/^## (.*$)/gim, '$1\n')
      .replace(/^# (.*$)/gim, '$1\n')
      .replace(/\*\*(.*)\*\*/gim, '$1')
      .replace(/\_(.*?)\_/gim, '$1')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '$1 ($2)');
  };
  
  return (
    <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileDown className="h-5 w-5" />
          Export Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Export Format</Label>
          <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="markdown" id="format-markdown" />
              <Label htmlFor="format-markdown" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Markdown (.md)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="html" id="format-html" />
              <Label htmlFor="format-html" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                HTML (.html)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="text" id="format-text" />
              <Label htmlFor="format-text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Plain Text (.txt)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="format-json" />
              <Label htmlFor="format-json" className="flex items-center gap-2">
                <FileArchive className="h-4 w-4" />
                JSON (.json)
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="include-metadata" 
            checked={includeMetadata} 
            onCheckedChange={(checked) => setIncludeMetadata(checked as boolean)} 
          />
          <Label htmlFor="include-metadata">Include metadata</Label>
        </div>
        
        <Button 
          onClick={handleExport} 
          disabled={isExporting} 
          className="w-full gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4" />
              Export Content
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
