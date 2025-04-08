
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

// Re-export the Select sub-components
export { 
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue 
};

// Themed SelectTrigger
export const ThemeSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  React.ComponentPropsWithoutRef<typeof SelectTrigger>
>(({ className, ...props }, ref) => {
  const { isDark } = useTheme();
  
  return (
    <SelectTrigger
      ref={ref}
      className={cn(
        isDark
          ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-brand-500 focus:border-brand-500"
          : "bg-white border-slate-200 text-slate-900 focus:ring-brand-500 focus:border-brand-500",
        className
      )}
      {...props}
    />
  );
});
ThemeSelectTrigger.displayName = "ThemeSelectTrigger";

// Themed SelectContent
export const ThemeSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectContent>,
  React.ComponentPropsWithoutRef<typeof SelectContent>
>(({ className, ...props }, ref) => {
  const { isDark } = useTheme();
  
  return (
    <SelectContent
      ref={ref}
      className={cn(
        isDark
          ? "bg-slate-800 border-slate-700 text-slate-100"
          : "bg-white border-slate-200 text-slate-900",
        className
      )}
      {...props}
    />
  );
});
ThemeSelectContent.displayName = "ThemeSelectContent";

// Themed Select component
export const ThemeSelect = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Select> & {
    triggerClassName?: string;
    contentClassName?: string;
  }
>(({ children, triggerClassName, contentClassName, ...props }, ref) => {
  // Analyze children to wrap them in themed components if they're not already
  const enhancedChildren = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    
    // Handle SelectTrigger
    if (child.type === SelectTrigger) {
      return (
        <ThemeSelectTrigger {...child.props} className={cn(child.props.className, triggerClassName)} />
      );
    }
    
    // Handle SelectContent
    if (child.type === SelectContent) {
      return (
        <ThemeSelectContent {...child.props} className={cn(child.props.className, contentClassName)} />
      );
    }
    
    return child;
  });
  
  return (
    <Select {...props}>
      {enhancedChildren}
    </Select>
  );
});
ThemeSelect.displayName = "ThemeSelect";
