import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserHelp } from "@/components/help/UserHelp";
import { ContextualHelp } from "@/components/help/ContextualHelp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Projects } from "./pages/projects/Projects";
import { ConfigurationWizard } from "./components/wizard/ConfigurationWizard";
import { ProjectWorkspace } from "./pages/projects/ProjectWorkspace";
import { ContentWorkspace } from "./pages/projects/ContentWorkspace";
import { AnalysisWorkspace } from "./pages/projects/AnalysisWorkspace";
import { EnhancementsWorkspace } from "./pages/projects/EnhancementsWorkspace";
import { KnowledgeBase } from "./pages/projects/KnowledgeBase";
import { KnowledgeBaseAdvanced } from "./pages/projects/KnowledgeBaseAdvanced";
import { ContentCreation } from "./pages/projects/ContentCreation";
import { ConfigurationWorkspace } from "./pages/projects/ConfigurationWorkspace";
import { SnapshotsWorkspace } from "./pages/projects/SnapshotsWorkspace";
import { Settings } from "./pages/settings/Settings";
import { Help } from "./pages/help/Help";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/auth/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const hasAuth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(hasAuth);
  }, []);
  
  const login = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    toast({
      title: "Logged in successfully",
      description: "Welcome to MultiGuide!",
    });
  };
  
  const logout = () => {
    localStorage.setItem('isAuthenticated', 'false');
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.handleLogin = login;
      window.handleLogout = logout;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.handleLogin;
        delete window.handleLogout;
      }
    };
  }, []);
  
  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
    </div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="/auth/login" element={<LoginPage onLoginSuccess={login} />} />
            <Route path="/auth/register" element={<RegisterPage onRegisterSuccess={login} />} />
            
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth/login" />} />
            <Route path="/projects" element={isAuthenticated ? <Projects /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/new" element={isAuthenticated ? <ConfigurationWizard /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId" element={isAuthenticated ? <ProjectWorkspace /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/knowledge-base" element={isAuthenticated ? <KnowledgeBase /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/knowledge-base/advanced" element={isAuthenticated ? <KnowledgeBaseAdvanced /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/content" element={isAuthenticated ? <ContentWorkspace /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/content/new" element={isAuthenticated ? <ContentCreation /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/analysis" element={isAuthenticated ? <AnalysisWorkspace /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/enhancements" element={isAuthenticated ? <EnhancementsWorkspace /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/configuration" element={isAuthenticated ? <ConfigurationWorkspace /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/snapshots" element={isAuthenticated ? <SnapshotsWorkspace /> : <Navigate to="/auth/login" />} />
            <Route path="/help" element={isAuthenticated ? <Help /> : <Navigate to="/auth/login" />} />
            <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/auth/login" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {isAuthenticated && (
            <>
              <UserHelp />
              <ContextualHelp />
            </>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
