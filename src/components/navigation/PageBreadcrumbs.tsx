
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface PageBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const PageBreadcrumbs: React.FC<PageBreadcrumbsProps> = ({ items }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="flex" aria-label="Breadcrumbs">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <React.Fragment key={index}>
              <li>
                {isLast ? (
                  <span
                    className={`font-medium ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className={
                      isDark
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }
                  >
                    {item.label}
                  </Link>
                )}
              </li>
              
              {!isLast && (
                <li className="text-slate-400">
                  <ChevronRight size={16} />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
