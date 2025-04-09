
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { SearchBar } from '@/components/layout/search/SearchBar';
import { NotificationPanel } from './notifications/NotificationPanel';
import { ThemeToggle } from './theme/ThemeToggle';
import { NewProjectButton } from '../projects/NewProjectButton';
import { HelpCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeButton } from '@/components/shared/ThemeButton';
import { ThemeTooltip } from '@/components/shared/ThemeTooltip';
import { useDashboard } from '@/contexts/DashboardContext';

export const ModernTopBar = React.memo(function ModernTopBar() {
  const { toast } = useToast();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const dashboard = useDashboard();

  const handleHelpClick = React.useCallback(() => {
    navigate('/help');
  }, [navigate]);

  return (
    <header 
      className={`h-16 border-b ${
        isDark 
          ? 'border-slate-800 bg-slate-900' 
          : 'border-slate-200 bg-white'
      } px-4 flex items-center sticky top-0 z-10`}
      role="banner"
      aria-label="Page header"
    >
      <div className="flex items-center space-x-2">
        <SidebarTrigger 
          aria-label="Toggle sidebar" 
          aria-expanded="false"
          aria-controls="main-sidebar"
        />
      </div>
      
      <div className="flex-1 pl-4 pr-4 max-w-2xl mx-auto">
        <SearchBar 
          searchTerm={dashboard.searchTerm} 
          setSearchTerm={dashboard.setSearchTerm} 
        />
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <NewProjectButton />
        
        <ThemeToggle />
        
        <ThemeTooltip content="Help">
          <ThemeButton 
            variant="ghost" 
            size="icon" 
            className="hidden sm:flex"
            onClick={handleHelpClick}
            aria-label="Open help page"
          >
            <HelpCircle className="h-5 w-5" />
          </ThemeButton>
        </ThemeTooltip>

        <NotificationPanel />
      </div>
    </header>
  );
});
