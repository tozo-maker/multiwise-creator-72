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
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
  </div>
);

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
const CreateProject = lazy(() => import("./pages/projects/CreateProject"));
const UserProfile = lazy(() => import("./pages/profile/UserProfile"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {}
  }
});

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
  const { startTour, TourComponent } = useGuidedTour();
  
  return (
    <>
      {TourComponent}
      
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/projects/new" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
            <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectWorkspace /></ProtectedRoute>} />
            <Route path="/projects/:projectId/knowledge-base" element={<ProtectedRoute><KnowledgeBase /></ProtectedRoute>} />
            <Route path="/projects/:projectId/knowledge-base/advanced" element={<ProtectedRoute><KnowledgeBaseAdvanced /></ProtectedRoute>} />
            <Route path="/projects/:projectId/content" element={<ProtectedRoute><ContentWorkspace /></ProtectedRoute>} />
            <Route path="/projects/:projectId/content/new" element={<ProtectedRoute><ContentCreation /></ProtectedRoute>} />
            <Route path="/projects/:projectId/analysis" element={<ProtectedRoute><AnalysisWorkspace /></ProtectedRoute>} />
            <Route path="/projects/:projectId/enhancements" element={<ProtectedRoute><EnhancementsWorkspace /></ProtectedRoute>} />
            <Route path="/projects/:projectId/configuration" element={<ProtectedRoute><ConfigurationWorkspace /></ProtectedRoute>} />
            <Route path="/projects/:projectId/snapshots" element={<ProtectedRoute><SnapshotsWorkspace /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/knowledge-base" element={<ProtectedRoute><KnowledgeBasePage /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <UserHelp />
          <ContextualHelp />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isChecking, setIsChecking] = useState(true);
  const { session, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      setIsChecking(false);
    }
  }, [isLoading]);
  
  if (isChecking || isLoading) {
    return <LoadingScreen />;
  }
  
  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
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
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
