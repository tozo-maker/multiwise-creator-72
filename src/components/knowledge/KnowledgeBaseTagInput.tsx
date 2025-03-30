
import React, { useState } from 'react';
import { X, Tag, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface KnowledgeBaseTagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export const KnowledgeBaseTagInput: React.FC<KnowledgeBaseTagInputProps> = ({
  tags,
  onChange
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    if (inputValue && !tags.includes(inputValue.trim())) {
      const newTags = [...tags, inputValue.trim()];
      onChange(newTags);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-2">
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
      
      <div className="flex flex-wrap gap-2">
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
    </div>
  );
};
