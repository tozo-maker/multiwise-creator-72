
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Tag, Plus, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { KBFile } from './KnowledgeBaseFileList';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeBaseTagManagerProps {
  file: KBFile | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTagsUpdated: (file: KBFile, tags: string[]) => void;
}

export const KnowledgeBaseTagManager: React.FC<KnowledgeBaseTagManagerProps> = ({
  file,
  isOpen,
  onOpenChange,
  onTagsUpdated
}) => {
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [popularTags, setPopularTags] = useState<{tag: string, count: number}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load tags when file changes
  useEffect(() => {
    if (file && isOpen) {
      setTags(file.tags || []);
      fetchPopularTags();
    }
  }, [file, isOpen]);

  const fetchPopularTags = async () => {
    if (!file?.project_id) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('knowledge_base_files')
        .select('tags')
        .eq('project_id', file.project_id)
        .not('tags', 'is', null);
      
      if (error) throw error;
      
      // Count tag occurrences
      const tagCounts: Record<string, number> = {};
      data.forEach(item => {
        if (item.tags && Array.isArray(item.tags)) {
          item.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });
      
      // Convert to array and sort
      const sortedTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 tags
      
      setPopularTags(sortedTags);
    } catch (error) {
      console.error('Error fetching popular tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (inputValue && !tags.includes(inputValue.trim())) {
      const newTags = [...tags, inputValue.trim()];
      setTags(newTags);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleQuickAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleSaveTags = async () => {
    if (!file) return;
    
    try {
      setIsLoading(true);
      
      // Update the file with new tags
      onTagsUpdated(file, tags);
      
      toast({
        title: 'Tags updated',
        description: `Updated tags for ${file.name}`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving tags:', error);
      toast({
        title: 'Error',
        description: 'Failed to update tags',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Tag className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tags..."
                className="pl-8"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={addTag}
              disabled={!inputValue}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 min-h-10">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button 
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {tags.length === 0 && (
              <p className="text-sm text-slate-500">No tags added yet</p>
            )}
          </div>
          
          {popularTags.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Popular tags:</h4>
              <div className="flex flex-wrap gap-1">
                {popularTags.map((item, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => handleQuickAddTag(item.tag)}
                  >
                    {item.tag} ({item.count})
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveTags}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Tags
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
