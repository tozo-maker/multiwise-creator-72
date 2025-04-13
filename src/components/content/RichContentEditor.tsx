
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { Bold, Italic, Underline, List, ListOrdered, Image, Link, Code, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface RichContentEditorProps {
  initialContent: string;
  onSaveContent: (content: string) => void;
  readOnly?: boolean;
}

export const RichContentEditor: React.FC<RichContentEditorProps> = ({
  initialContent,
  onSaveContent,
  readOnly = false
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);
  
  const insertFormatting = (tag: string, placeholder = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    
    let newContent = '';
    switch (tag) {
      case 'bold':
        newContent = content.substring(0, start) + `**${selected || 'bold text'}**` + content.substring(end);
        break;
      case 'italic':
        newContent = content.substring(0, start) + `_${selected || 'italic text'}_` + content.substring(end);
        break;
      case 'heading1':
        newContent = content.substring(0, start) + `\n# ${selected || 'Heading 1'}\n` + content.substring(end);
        break;
      case 'heading2':
        newContent = content.substring(0, start) + `\n## ${selected || 'Heading 2'}\n` + content.substring(end);
        break;
      case 'heading3':
        newContent = content.substring(0, start) + `\n### ${selected || 'Heading 3'}\n` + content.substring(end);
        break;
      case 'list':
        newContent = content.substring(0, start) + `\n- ${selected || 'List item'}\n- Another item\n- One more item\n` + content.substring(end);
        break;
      case 'ordered-list':
        newContent = content.substring(0, start) + `\n1. ${selected || 'First item'}\n2. Second item\n3. Third item\n` + content.substring(end);
        break;
      case 'link':
        newContent = content.substring(0, start) + `[${selected || 'link text'}](URL)` + content.substring(end);
        break;
      case 'image':
        newContent = content.substring(0, start) + `![${selected || 'image alt text'}](IMAGE_URL)` + content.substring(end);
        break;
      case 'code':
        newContent = content.substring(0, start) + "```\n" + (selected || 'code goes here') + "\n```" + content.substring(end);
        break;
    }
    
    setContent(newContent);
    
    // Re-focus the textarea and set the cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
    }, 10);
  };
  
  const renderPreview = () => {
    const markdownToHtml = (markdown: string) => {
      let html = markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        // Italic
        .replace(/\_(.*?)\_/gim, '<em>$1</em>')
        // Lists
        .replace(/^\- (.*)$/gim, '<li>$1</li>')
        .replace(/\<\/li\>\n\<li\>/g, '</li><li>')
        .replace(/([\n\r])\<li\>/, '$1<ul><li>')
        .replace(/\<\/li\>([\n\r])(?!\<li\>)/, '</li></ul>$1')
        // Ordered Lists
        .replace(/^\d\. (.*)$/gim, '<li>$1</li>')
        // Images
        .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />')
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
        // Code
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        // Paragraphs
        .replace(/\n\n/g, '</p><p>');
      
      return `<p>${html}</p>`;
    };
    
    return (
      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
    );
  };
  
  const handleSave = () => {
    onSaveContent(content);
    toast({
      title: 'Content Saved',
      description: 'Your content has been saved successfully'
    });
  };
  
  return (
    <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            {!readOnly && (
              <Button 
                onClick={handleSave} 
                variant="outline" 
                size="sm"
                className="gap-1"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            )}
          </div>
          
          <TabsContent value="edit" className="m-0 p-0">
            {!readOnly && (
              <div className="bg-slate-100 dark:bg-slate-700 p-2 mb-4 rounded-md flex flex-wrap gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('bold')}
                  className="h-8 w-8 p-0"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('italic')}
                  className="h-8 w-8 p-0"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('heading1')}
                  className="h-8 w-8 p-0"
                >
                  <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('heading2')}
                  className="h-8 w-8 p-0"
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('heading3')}
                  className="h-8 w-8 p-0"
                >
                  <Heading3 className="h-4 w-4" />
                </Button>
                <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('ordered-list')}
                  className="h-8 w-8 p-0"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('link')}
                  className="h-8 w-8 p-0"
                >
                  <Link className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('image')}
                  className="h-8 w-8 p-0"
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('code')}
                  className="h-8 w-8 p-0"
                >
                  <Code className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <Textarea
              id="content-editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              readOnly={readOnly}
            />
          </TabsContent>
          
          <TabsContent value="preview" className="m-0 p-0">
            <div className={`border rounded-md p-4 min-h-[400px] ${
              isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
            }`}>
              {renderPreview()}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
