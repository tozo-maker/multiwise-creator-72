
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { motion } from 'framer-motion';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageBreadcrumbsProps {
  items: BreadcrumbItem[];
  homeLink?: string;
  className?: string;
}

export const PageBreadcrumbs: React.FC<PageBreadcrumbsProps> = ({ 
  items,
  homeLink = '/dashboard',
  className
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Don't show breadcrumbs on the dashboard itself to avoid duplication
  if (currentPath === '/dashboard') {
    return null;
  }
  
  // Filter out any duplicate items
  const uniqueItems = items.filter((item, index, self) => 
    index === self.findIndex((t) => t.label === item.label)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${className || ''}`}
    >
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={homeLink} className="flex items-center text-slate-600 hover:text-brand-600 transition-colors">
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {uniqueItems.length > 0 && (
            <BreadcrumbSeparator aria-hidden>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </BreadcrumbSeparator>
          )}
          
          {uniqueItems.map((item, index) => {
            const isLast = index === uniqueItems.length - 1;
            
            return (
              <React.Fragment key={index}>
                {isLast ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-slate-800 font-medium">{item.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link 
                          to={item.path || '#'} 
                          className="text-slate-600 hover:text-brand-600 transition-colors"
                        >
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator aria-hidden>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </BreadcrumbSeparator>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </motion.div>
  );
};
