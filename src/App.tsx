import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from '@/pages/Index';
import Dashboard from '@/pages/dashboard/Dashboard';
import Projects from '@/pages/projects/Projects';
import { CreateProject } from '@/pages/projects/CreateProject';
import { ProjectWorkspace } from '@/pages/projects/ProjectWorkspace';
import { ConfigurationWorkspace } from '@/pages/projects/ConfigurationWorkspace';
import ContentWorkspace from '@/pages/projects/ContentWorkspace';
import { AnalysisWorkspace } from '@/pages/projects/AnalysisWorkspace';
import { EnhancementsWorkspace } from '@/pages/projects/EnhancementsWorkspace';
import { SnapshotsWorkspace } from '@/pages/projects/SnapshotsWorkspace';
import { KnowledgeBase } from '@/pages/projects/KnowledgeBase';
import KnowledgeBasePage from '@/pages/knowledge/KnowledgeBasePage';
import { KnowledgeBaseAdvanced } from '@/pages/projects/KnowledgeBaseAdvanced';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import UserProfile from '@/pages/profile/UserProfile';
import { Analytics } from '@/pages/analytics/Analytics';
import { Settings } from '@/pages/settings/Settings';
import { Help } from '@/pages/help/Help';
import NotFound from '@/pages/error/NotFound';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import ContentCreation from '@/pages/projects/ContentCreation';
import ContentView from '@/pages/projects/ContentView';

function App() {
  const { theme } = useTheme();
  const { isLoading, user } = useAuth();
  const isDark = theme === 'dark';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
        Loading...
      </div>
    );
  }

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
            
            <Route path="/projects/create" element={<CreateProject />} />
            <Route path="/projects/:projectId" element={<ProjectWorkspace />} />
            <Route path="/projects/:projectId/configuration" element={<ConfigurationWorkspace />} />
            <Route path="/projects/:projectId/content" element={<ContentWorkspace />} />
            <Route path="/projects/:projectId/content/create" element={<ContentCreation />} />
            <Route path="/projects/:projectId/content/:contentId" element={<ContentView />} />
            <Route path="/projects/:projectId/analysis" element={<AnalysisWorkspace />} />
            <Route path="/projects/:projectId/enhancements" element={<EnhancementsWorkspace />} />
            <Route path="/projects/:projectId/snapshots" element={<SnapshotsWorkspace />} />
            <Route path="/projects/:projectId/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/projects/:projectId/knowledge-base/advanced" element={<KnowledgeBaseAdvanced />} />
            <Route path="/projects/:projectId/config" element={<ConfigurationWorkspace />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
