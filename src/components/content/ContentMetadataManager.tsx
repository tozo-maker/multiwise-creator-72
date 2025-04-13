
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  CalendarIcon, 
  Tag, 
  Plus, 
  X, 
  Book, 
  Languages, 
  ClipboardList,
  Save,
  Clock
} from 'lucide-react';
import { ContentItem, ContentMetadata, ContentService } from '@/services/ContentService';
import { toast } from '@/hooks/use-toast';

interface ContentMetadataManagerProps {
  contentItem: ContentItem;
  onMetadataChange?: (metadata: ContentMetadata) => void;
  readOnly?: boolean;
}

export const ContentMetadataManager: React.FC<ContentMetadataManagerProps> = ({
  contentItem,
  onMetadataChange,
  readOnly = false
}) => {
  const { isDark } = useTheme();
  const [metadata, setMetadata] = useState<ContentMetadata>(contentItem.metadata || {});
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize metadata from contentItem
  useEffect(() => {
    setMetadata(contentItem.metadata || {});
  }, [contentItem]);
  
  const handleMetadataChange = (field: keyof ContentMetadata, value: any) => {
    const updatedMetadata = { ...metadata, [field]: value };
    setMetadata(updatedMetadata);
    if (onMetadataChange) {
      onMetadataChange(updatedMetadata);
    }
  };
  
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    const currentTags = metadata.tags || [];
    if (!currentTags.includes(newTag.trim())) {
      const updatedTags = [...currentTags, newTag.trim()];
      handleMetadataChange('tags', updatedTags);
    }
    setNewTag('');
  };
  
  const handleRemoveTag = (tag: string) => {
    const updatedTags = (metadata.tags || []).filter(t => t !== tag);
    handleMetadataChange('tags', updatedTags);
  };
  
  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    
    const currentKeywords = metadata.keywords || [];
    if (!currentKeywords.includes(newKeyword.trim())) {
      const updatedKeywords = [...currentKeywords, newKeyword.trim()];
      handleMetadataChange('keywords', updatedKeywords);
    }
    setNewKeyword('');
  };
  
  const handleRemoveKeyword = (keyword: string) => {
    const updatedKeywords = (metadata.keywords || []).filter(k => k !== keyword);
    handleMetadataChange('keywords', updatedKeywords);
  };
  
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    const currentCategories = metadata.categories || [];
    if (!currentCategories.includes(newCategory.trim())) {
      const updatedCategories = [...currentCategories, newCategory.trim()];
      handleMetadataChange('categories', updatedCategories);
    }
    setNewCategory('');
  };
  
  const handleRemoveCategory = (category: string) => {
    const updatedCategories = (metadata.categories || []).filter(c => c !== category);
    handleMetadataChange('categories', updatedCategories);
  };
  
  const saveMetadata = async () => {
    if (readOnly) return;
    
    setIsSaving(true);
    try {
      const result = await ContentService.updateMetadata(contentItem.id, metadata);
      
      if (result) {
        toast({
          title: 'Metadata updated',
          description: 'Content metadata has been saved successfully',
        });
      } else {
        throw new Error('Failed to update metadata');
      }
    } catch (error) {
      console.error('Error saving metadata:', error);
      toast({
        title: 'Error',
        description: 'Failed to save metadata changes',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAutogenerate = async () => {
    if (!contentItem.content || readOnly) return;
    
    setIsSaving(true);
    try {
      // Extract metadata from content
      const extractedMetadata = await ContentService.extractMetadata(contentItem.content);
      
      // Merge with existing metadata
      const mergedMetadata = {
        ...metadata,
        ...extractedMetadata,
        // For arrays like keywords, merge them
        keywords: [
          ...(metadata.keywords || []),
          ...(extractedMetadata.keywords || []).filter(
            k => !(metadata.keywords || []).includes(k)
          )
        ]
      };
      
      setMetadata(mergedMetadata);
      if (onMetadataChange) {
        onMetadataChange(mergedMetadata);
      }
      
      toast({
        title: 'Metadata extracted',
        description: 'Metadata has been automatically extracted from content',
      });
    } catch (error) {
      console.error('Error extracting metadata:', error);
      toast({
        title: 'Error',
        description: 'Failed to extract metadata',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className={isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          <span>Content Metadata</span>
        </CardTitle>
        <CardDescription>
          Manage detailed metadata for this content
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Metadata */}
        <div>
          <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={metadata.description || ''}
                onChange={(e) => handleMetadataChange('description', e.target.value)}
                placeholder="Brief description of the content"
                className={isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}
                disabled={readOnly}
              />
            </div>
            
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={metadata.author || ''}
                onChange={(e) => handleMetadataChange('author', e.target.value)}
                placeholder="Content author"
                className={isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}
                disabled={readOnly}
              />
            </div>
            
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={metadata.language || ''}
                onValueChange={(value) => handleMetadataChange('language', value)}
                disabled={readOnly}
              >
                <SelectTrigger 
                  className={isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}
                >
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="difficultyLevel">Difficulty Level</Label>
              <Select
                value={metadata.difficultyLevel || ''}
                onValueChange={(value) => handleMetadataChange('difficultyLevel', value)}
                disabled={readOnly}
              >
                <SelectTrigger 
                  className={isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}
                >
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Separator className={isDark ? 'bg-slate-700' : 'bg-slate-200'} />
        
        {/* Educational Metadata */}
        <div>
          <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <Book className="h-4 w-4 inline-block mr-2" />
            Educational Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="educationalLevel">Educational Level</Label>
              <Select
                value={metadata.educationalLevel || ''}
                onValueChange={(value) => handleMetadataChange('educationalLevel', value)}
                disabled={readOnly}
              >
                <SelectTrigger 
                  className={isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}
                >
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elementary">Elementary</SelectItem>
                  <SelectItem value="middle-school">Middle School</SelectItem>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="adult">Adult Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="estimatedDuration">Estimated Duration (mins)</Label>
              <Input
                id="estimatedDuration"
                type="number"
                value={metadata.estimatedDuration || ''}
                onChange={(e) => handleMetadataChange('estimatedDuration', Number(e.target.value))}
                placeholder="Duration in minutes"
                className={isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}
                disabled={readOnly}
              />
            </div>
          </div>
          
          {/* Learning Objectives */}
          <div className="mt-3">
            <Label htmlFor="learningObjectives">Learning Objectives</Label>
            <div className="flex gap-2 mt-1 flex-wrap">
              {(metadata.learningObjectives || []).map((objective, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1">
                  {objective}
                  {!readOnly && (
                    <button 
                      onClick={() => {
                        const updatedObjectives = [...(metadata.learningObjectives || [])];
                        updatedObjectives.splice(index, 1);
                        handleMetadataChange('learningObjectives', updatedObjectives);
                      }}
                      className="ml-1 hover:bg-slate-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            
            {!readOnly && (
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add learning objective"
                  value=""
                  onChange={(e) => {}}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      const newObjective = e.currentTarget.value.trim();
                      handleMetadataChange('learningObjectives', [
                        ...(metadata.learningObjectives || []),
                        newObjective
                      ]);
                      e.currentTarget.value = '';
                    }
                  }}
                  className={isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add learning objective"]') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      handleMetadataChange('learningObjectives', [
                        ...(metadata.learningObjectives || []),
                        input.value.trim()
                      ]);
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <Separator className={isDark ? 'bg-slate-700' : 'bg-slate-200'} />
        
        {/* Classification */}
        <div>
          <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <Tag className="h-4 w-4 inline-block mr-2" />
            Classification
          </h3>
          
          {/* Tags */}
          <div className="mb-4">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {(metadata.tags || []).map((tag, index) => (
                <Badge key={index} className="flex items-center gap-1 py-1">
                  {tag}
                  {!readOnly && (
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-slate-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            
            {!readOnly && (
              <div className="flex gap-2 mt-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className={isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag();
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddTag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Categories */}
          <div className="mb-4">
            <Label htmlFor="categories">Categories</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {(metadata.categories || []).map((category, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className={`flex items-center gap-1 py-1 ${
                    isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {category}
                  {!readOnly && (
                    <button 
                      onClick={() => handleRemoveCategory(category)}
                      className="ml-1 hover:bg-slate-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            
            {!readOnly && (
              <div className="flex gap-2 mt-2">
                <Input
                  id="categories"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add a category"
                  className={isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCategory();
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddCategory}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Keywords */}
          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {(metadata.keywords || []).map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="flex items-center gap-1 py-1"
                >
                  {keyword}
                  {!readOnly && (
                    <button 
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="ml-1 hover:bg-slate-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            
            {!readOnly && (
              <div className="flex gap-2 mt-2">
                <Input
                  id="keywords"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add a keyword"
                  className={isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddKeyword();
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddKeyword}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <Separator className={isDark ? 'bg-slate-700' : 'bg-slate-200'} />
        
        {/* Technical Information */}
        <div>
          <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Technical Information
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Word Count</Label>
              <div className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {metadata.wordCount || 'Not calculated'}
              </div>
            </div>
            
            <div>
              <Label>Content Format</Label>
              <div className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {metadata.contentFormat || 'Markdown'}
              </div>
            </div>
          </div>
        </div>
        
        {!readOnly && (
          <>
            <Separator className={isDark ? 'bg-slate-700' : 'bg-slate-200'} />
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleAutogenerate}
                disabled={isSaving}
              >
                <Clock className="h-4 w-4 mr-2" />
                Auto-extract metadata
              </Button>
              
              <Button
                onClick={saveMetadata}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
