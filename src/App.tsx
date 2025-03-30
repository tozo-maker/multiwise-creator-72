
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserHelp } from "@/components/help/UserHelp";
import { ContextualHelp } from "@/components/help/ContextualHelp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { CreateProject } from "./pages/projects/CreateProject";
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
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/auth/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // Check if user is authenticated
  useEffect(() => {
    // In a real app, you'd check for a token or session
    // For demo, we'll just use localStorage
    const hasAuth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(hasAuth);
  }, []);
  
  // For demo purposes, we can let users "log in" and "log out"
  // This would be replaced with actual auth logic in a real app
  if (isAuthenticated === null) {
    // Still loading auth state
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/new" element={isAuthenticated ? <CreateProject /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId" element={isAuthenticated ? <ProjectWorkspace /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/knowledge-base" element={isAuthenticated ? <KnowledgeBase /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/knowledge-base/advanced" element={isAuthenticated ? <KnowledgeBaseAdvanced /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/content" element={isAuthenticated ? <ContentWorkspace /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/content/new" element={isAuthenticated ? <ContentCreation /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/analysis" element={isAuthenticated ? <AnalysisWorkspace /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/enhancements" element={isAuthenticated ? <EnhancementsWorkspace /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/configuration" element={isAuthenticated ? <ConfigurationWorkspace /> : <Navigate to="/auth/login" />} />
            <Route path="/projects/:projectId/snapshots" element={isAuthenticated ? <SnapshotsWorkspace /> : <Navigate to="/auth/login" />} />
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
