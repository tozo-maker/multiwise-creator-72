
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  FolderPlus, 
  Settings, 
  LogOut, 
  Database, 
  HelpCircle,
  Users,
  Sparkles,
  BookText 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    // In a real app, this would call an API to logout
    localStorage.setItem('isAuthenticated', 'false');
    
    // Use the window.handleLogout if it exists (from App.tsx)
    if (typeof window !== 'undefined' && window.handleLogout) {
      // @ts-ignore
      window.handleLogout();
    }
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    navigate('/');
  };

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-brand-500 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">MultiGuide</span>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="px-3 flex-1">
        <div className="space-y-1">
          <NavItem 
            icon={<Home className="h-5 w-5" />} 
            text="Dashboard" 
            to="/dashboard" 
            active={isActive('/dashboard')}
          />
          <NavItem 
            icon={<BookText className="h-5 w-5" />} 
            text="My Projects" 
            to="/projects" 
            active={isActive('/projects')}
          />
          <NavItem 
            icon={<FolderPlus className="h-5 w-5" />} 
            text="New Project" 
            to="/projects/new" 
            active={isActive('/projects/new')}
          />
        </div>
        
        <div className="mt-10">
          <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Account
          </h3>
          <div className="mt-2 space-y-1">
            <NavItem 
              icon={<Settings className="h-5 w-5" />} 
              text="Settings" 
              to="/settings" 
              active={isActive('/settings')}
            />
            <NavItem 
              icon={<HelpCircle className="h-5 w-5" />} 
              text="Help" 
              to="/help" 
              active={isActive('/help')}
            />
          </div>
        </div>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 w-full px-3 py-2 transition-colors rounded-md"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, to, active = false }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
        active 
          ? "bg-brand-50 text-brand-700 font-medium" 
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      )}
    >
      <span className={cn(active ? "text-brand-600" : "text-slate-500")}>
        {icon}
      </span>
      <span>{text}</span>
    </Link>
  );
};
