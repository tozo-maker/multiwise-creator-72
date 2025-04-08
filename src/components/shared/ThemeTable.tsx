
import React from 'react';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from '@/components/ui/table';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

// Re-export the Table components
export { 
  TableHeader, 
  TableBody, 
  TableFooter, 
  TableHead, 
  TableRow, 
  TableCaption 
};

// Enhanced TableCell with theme support
export const ThemeTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { isDark } = useTheme();
  
  return (
    <TableCell
      ref={ref}
      className={cn(
        "p-4 align-middle",
        isDark ? "text-slate-300" : "text-slate-700",
        className
      )}
      {...props}
    />
  );
});
ThemeTableCell.displayName = "ThemeTableCell";

// Themed Table component
export const ThemeTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => {
  const { isDark } = useTheme();
  
  return (
    <div className={cn(
      "relative w-full overflow-auto rounded-md",
      isDark ? "border border-slate-700" : "border border-slate-200",
      className
    )}>
      <Table
        ref={ref}
        className={cn(
          "w-full caption-bottom text-sm",
          isDark ? "bg-slate-800/50" : "bg-white"
        )}
        {...props}
      />
    </div>
  );
});
ThemeTable.displayName = "ThemeTable";
