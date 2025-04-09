
import React from 'react';
import { cn } from '@/lib/utils';
import { LayoutGrid, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';

export interface KBCategory {
  id: string;
  name: string;
  count: number;
  color: string;
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
  const { isDark } = useTheme();
  
  const handleClick = (categoryId: string | null) => {
    onSelectCategory(categoryId === activeCategory ? null : categoryId);
  };

  return (
    <div className="space-y-2">
      <Button 
        variant={activeCategory === null ? "default" : "outline"} 
        className={cn(
          "w-full justify-start gap-2 text-left", 
          activeCategory === null 
            ? "bg-primary text-white hover:bg-primary/90" 
            : isDark 
              ? "bg-slate-800 hover:bg-slate-700 text-slate-200" 
              : "bg-white hover:bg-slate-100 text-slate-800"
        )} 
        onClick={() => handleClick(null)}
      >
        <LayoutGrid className="h-4 w-4" />
        <span>All Categories</span>
        <Badge variant="secondary" className="ml-auto">
          {categories.reduce((sum, cat) => sum + cat.count, 0)}
        </Badge>
      </Button>

      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          className={cn(
            "w-full justify-start gap-2 text-left",
            activeCategory === category.id 
              ? "bg-primary text-white hover:bg-primary/90" 
              : isDark 
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200" 
                : "bg-white hover:bg-slate-100 text-slate-800"
          )}
          onClick={() => handleClick(category.id)}
        >
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></span>
          <span>{category.name}</span>
          <Badge variant="secondary" className="ml-auto">{category.count}</Badge>
        </Button>
      ))}
      
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start gap-2 mt-4",
          isDark 
            ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" 
            : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
        )}
        onClick={onAddCategory}
      >
        <Plus className="h-4 w-4" />
        <span>Add Category</span>
      </Button>
    </div>
  );
};
