
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { X, Plus, Tag } from 'lucide-react';

interface ContentTaggingSystemProps {
  initialTags: string[];
  initialCategory: string;
  onTagsChange: (tags: string[]) => void;
  onCategoryChange: (category: string) => void;
}

const PREDEFINED_CATEGORIES = [
  'Academic',
  'Tutorial',
  'Reference',
  'Assessment',
  'Activity',
  'Lesson',
  'Exercise',
  'Example',
  'Case Study',
  'Project',
  'Other'
];

export const ContentTaggingSystem: React.FC<ContentTaggingSystemProps> = ({
  initialTags = [],
  initialCategory = '',
  onTagsChange,
  onCategoryChange
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([
    'curriculum', 'assessment', 'interactive', 'elementary', 'middle-school',
    'high-school', 'undergraduate', 'graduate', 'beginner', 'intermediate',
    'advanced', 'stem', 'humanities', 'language', 'math', 'science'
  ]);
  
  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);
  
  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);
  
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      onTagsChange(newTags);
      setNewTag('');
      
      // Remove from suggestions if it was a suggested tag
      if (suggestedTags.includes(trimmedTag)) {
        setSuggestedTags(suggestedTags.filter(t => t !== trimmedTag));
      }
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    onTagsChange(newTags);
    
    // Add back to suggestions
    if (!suggestedTags.includes(tagToRemove)) {
      setSuggestedTags([...suggestedTags, tagToRemove]);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag) {
      e.preventDefault();
      addTag(newTag);
    }
  };
  
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onCategoryChange(value);
  };
  
  return (
    <Card className={isDark ? "bg-slate-800 border-slate-700" : "bg-white"}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Tags & Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Content Category
          </label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {PREDEFINED_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="py-1 px-2 gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeTag(tag)} 
                />
              </Badge>
            ))}
            {tags.length === 0 && (
              <span className="text-sm text-muted-foreground">
                No tags added yet
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a tag..."
              className="flex-1"
            />
            <Button 
              onClick={() => addTag(newTag)} 
              disabled={!newTag.trim()}
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {suggestedTags.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">
              Suggested Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.slice(0, 8).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => addTag(tag)}
                >
                  + {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
