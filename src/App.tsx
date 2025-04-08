
import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserHelp } from "@/components/help/UserHelp";
import { ContextualHelp } from "@/components/help/ContextualHelp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useGuidedTour } from "@/components/onboarding/GuidedTour";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

// Loading component for Suspense fallbacks
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
  </div>
);

// Lazy-loaded components for code splitting
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Projects = lazy(() => import("./pages/projects/Projects"));
const ProjectWorkspace = lazy(() => import("./pages/projects/ProjectWorkspace"));
const ConfigurationWizard = lazy(() => import("./components/wizard/ConfigurationWizard").then(
  module => ({ default: module.ConfigurationWizard })
));
const KnowledgeBase = lazy(() => import("./pages/projects/KnowledgeBase"));
const KnowledgeBaseAdvanced = lazy(() => import("./pages/projects/KnowledgeBaseAdvanced"));
const ContentWorkspace = lazy(() => import("./pages/projects/ContentWorkspace"));
const ContentCreation = lazy(() => import("./pages/projects/ContentCreation"));
const AnalysisWorkspace = lazy(() => import("./pages/projects/AnalysisWorkspace"));
const EnhancementsWorkspace = lazy(() => import("./pages/projects/EnhancementsWorkspace"));
const ConfigurationWorkspace = lazy(() => import("./pages/projects/ConfigurationWorkspace"));
const SnapshotsWorkspace = lazy(() => import("./pages/projects/SnapshotsWorkspace"));
const Analytics = lazy(() => import("./pages/analytics/Analytics"));
const KnowledgeBasePage = lazy(() => import("./pages/knowledge/KnowledgeBasePage"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const Help = lazy(() => import("./pages/help/Help"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LandingPage = lazy(() => import("./pages/auth/LandingPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));

// Configure React Query with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {}
  }
});

// Add global error handlers to log and display errors
queryClient.getQueryCache().subscribe(event => {
  if (event.type === 'updated' && event.action.type === 'error') {
    const error = event.action.error;
    console.error('Query error:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "There was an error loading data. Please try again.",
    });
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === 'updated' && event.action.type === 'error') {
    const error = event.action.error;
    console.error('Mutation error:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "There was an error saving your changes. Please try again.",
    });
  }
});

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { startTour, TourComponent } = useGuidedTour();
  
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
    
    // Check if it's user's first login
    const isFirstLogin = localStorage.getItem('firstLoginComplete') !== 'true';
    if (isFirstLogin) {
      localStorage.setItem('firstLoginComplete', 'true');
      // Small delay before starting tour
      setTimeout(() => {
        startTour();
      }, 1000);
    }
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
    return <LoadingScreen />;
  }

  return (
    <>
      {TourComponent}
      
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
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
            <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Navigate to="/auth/login" />} />
            <Route path="/knowledge-base" element={isAuthenticated ? <KnowledgeBasePage /> : <Navigate to="/auth/login" />} />
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
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
