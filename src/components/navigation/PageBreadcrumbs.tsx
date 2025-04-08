
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface BreadcrumbItemType {
  label: string;
  path?: string;
}

interface PageBreadcrumbsProps {
  items: BreadcrumbItemType[];
  className?: string;
  'aria-label'?: string;
}

export const PageBreadcrumbs = ({ 
  items,
  className = '',
  'aria-label': ariaLabel = 'Breadcrumb navigation'
}: PageBreadcrumbsProps) => {
  const { isDark } = useTheme();
  
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div 
      className={cn(
        "mb-6", 
        className
      )}
    >
      <Breadcrumb className={cn(
        isDark ? "text-slate-300" : "text-slate-600"
      )} aria-label={ariaLabel}>
        <BreadcrumbList>
          {items.map((item, index) => (
            <React.Fragment key={`breadcrumb-${index}`}>
              <BreadcrumbItem>
                {item.path ? (
                  <BreadcrumbLink 
                    asChild
                    className={cn(
                      "text-sm font-medium hover:underline",
                      isDark 
                        ? "text-slate-400 hover:text-slate-200" 
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <Link to={item.path}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <span 
                    className={cn(
                      "text-sm font-semibold",
                      isDark ? "text-slate-100" : "text-slate-900"
                    )}
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default PageBreadcrumbs;
