
import React from 'react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  name: string;
  href?: string;
  icon?: React.ReactNode;
}

interface ThemeBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  includeHome?: boolean;
}

export function ThemeBreadcrumbs({ 
  items, 
  className,
  includeHome = true 
}: ThemeBreadcrumbsProps) {
  const { isDark } = useTheme();
  
  const allItems = includeHome 
    ? [{ name: 'Home', href: '/dashboard', icon: <Home className="h-4 w-4" /> }, ...items]
    : items;
  
  return (
    <Breadcrumb className={cn(
      "mb-4",
      isDark ? "text-slate-400" : "text-slate-600",
      className
    )}>
      <BreadcrumbList>
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          
          return (
            <React.Fragment key={item.name}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className={cn(
                    "flex items-center", 
                    isDark ? "text-slate-200" : "text-slate-900"
                  )}>
                    {item.icon}
                    {item.icon && <span className="ml-1">{item.name}</span>}
                    {!item.icon && item.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link 
                      to={item.href || '#'} 
                      className={cn(
                        "flex items-center hover:underline", 
                        isDark ? "text-slate-400 hover:text-slate-300" : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      {item.icon}
                      {item.icon && <span className="ml-1">{item.name}</span>}
                      {!item.icon && item.name}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              
              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
