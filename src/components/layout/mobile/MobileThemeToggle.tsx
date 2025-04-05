
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MobileThemeToggle: React.FC = () => {
  return (
    <div className="px-3 py-4">
      <h4 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Theme
      </h4>
      <div className="mt-2 flex items-center space-x-2">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2">
          <Sun className="h-4 w-4" />
          Light
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start gap-2">
          <Moon className="h-4 w-4" />
          Dark
        </Button>
      </div>
    </div>
  );
};
