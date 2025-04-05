
import React from 'react';
import { motion } from 'framer-motion';
import { ProjectTemplate } from './ProjectTemplate';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

interface ProjectTemplateGalleryProps {
  templates: Template[];
  onSelect: (templateId: string) => void;
  selectedTemplate?: string;
}

export const ProjectTemplateGallery: React.FC<ProjectTemplateGalleryProps> = ({
  templates,
  onSelect,
  selectedTemplate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {templates.map((template) => (
        <motion.div
          key={template.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <ProjectTemplate 
            template={template}
            onSelect={() => onSelect(template.id)}
            isSelected={selectedTemplate === template.id}
          />
        </motion.div>
      ))}
    </div>
  );
};
