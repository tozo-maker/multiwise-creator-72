
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface KBCategory {
  id: string;
  name: string;
  count: number;
  color?: string;
}

interface KnowledgeBaseCategoriesProps {
  categories: KBCategory[];
  activeCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onAddCategory: () => void;
}

export const KnowledgeBaseCategories: React.FC<KnowledgeBaseCategoriesProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  onAddCategory
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Categories</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onAddCategory}
            className="h-8 px-2"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            <span>Add</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button 
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => onSelectCategory(null)}
          >
            All Documents
            <Badge className="ml-auto" variant="secondary">
              {categories.reduce((total, cat) => total + cat.count, 0)}
            </Badge>
          </Button>
          
          {categories.map((category) => (
            <Button 
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => onSelectCategory(category.id)}
            >
              {category.name}
              <Badge 
                className="ml-auto" 
                variant="secondary"
                style={category.color ? { backgroundColor: category.color + '20', color: category.color } : undefined}
              >
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
