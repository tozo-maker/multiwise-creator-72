
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
  const isProjectRoute = location.pathname.includes('/projects/');
  
  // Ensure breadcrumbs are always shown on project routes
  React.useEffect(() => {
    // This effect ensures breadcrumbs are maintained across project tab navigation
    // No action needed as we'll handle it via static rendering
  }, [location.pathname]);

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
          
          <BreadcrumbSeparator aria-hidden>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </BreadcrumbSeparator>
          
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
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
