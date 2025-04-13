
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, FileText, BookOpen, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SheetClose } from '@/components/ui/sheet';
import { OutlineNavigation } from '@/components/outline/OutlineNavigation';

export const MobileProjectNavigation: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const projectId = params.projectId;
  
  if (!projectId) return null;
  
  const projectNavItems = [
    { text: "Overview", to: `/projects/${projectId}`, icon: LayoutGrid },
    { text: "Knowledge Base", to: `/projects/${projectId}/knowledge-base`, icon: BookOpen },
    { text: "Content", to: `/projects/${projectId}/content`, icon: FileText },
    { text: "Analysis", to: `/projects/${projectId}/analysis` },
    { text: "Enhancements", to: `/projects/${projectId}/enhancements` },
    { text: "Configuration", to: `/projects/${projectId}/configuration` },
    { text: "Snapshots", to: `/projects/${projectId}/snapshots` },
  ];

  return (
    <Accordion type="multiple" className="px-2 mt-4">
      <AccordionItem value="project-navigation" className="border-b-0">
        <AccordionTrigger className="py-2 px-3 hover:no-underline">
          <span className="text-sm font-medium">Current Project</span>
        </AccordionTrigger>
        <AccordionContent>
          <nav className="space-y-1 mt-1">
            {projectNavItems.map((item, i) => (
              <SheetClose asChild key={i}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors",
                    location.pathname === item.to
                      ? "bg-brand-50 text-brand-700 font-medium" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.text}</span>
                  {location.pathname === item.to && (
                    <ChevronRight className="h-4 w-4 ml-auto text-brand-600" />
                  )}
                </Link>
              </SheetClose>
            ))}
          </nav>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="outline" className="border-b-0">
        <AccordionTrigger className="py-2 px-3 hover:no-underline">
          <span className="text-sm font-medium">Project Outline</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-2">
            <OutlineNavigation 
              projectId={projectId} 
              displayMode="compact" 
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
