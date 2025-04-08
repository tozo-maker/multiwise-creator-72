
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContentFormHeaderProps {
  title: string;
  setTitle: (value: string) => void;
  identifier: string;
  setIdentifier: (value: string) => void;
}

export const ContentFormHeader: React.FC<ContentFormHeaderProps> = ({
  title,
  setTitle,
  identifier,
  setIdentifier
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Chapter/Section Title</Label>
          <Input 
            id="title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="identifier">Identifier (Optional)</Label>
          <Input 
            id="identifier" 
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="e.g., Chapter 3, Section 2.1"
          />
        </div>
      </div>
    </div>
  );
};
