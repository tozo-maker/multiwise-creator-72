
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserHelp } from "@/components/help/UserHelp";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects/new" element={<CreateProject />} />
          <Route path="/projects/:projectId" element={<ProjectWorkspace />} />
          <Route path="/projects/:projectId/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/projects/:projectId/knowledge-base/advanced" element={<KnowledgeBaseAdvanced />} />
          <Route path="/projects/:projectId/content" element={<ContentWorkspace />} />
          <Route path="/projects/:projectId/content/new" element={<ContentCreation />} />
          <Route path="/projects/:projectId/analysis" element={<AnalysisWorkspace />} />
          <Route path="/projects/:projectId/enhancements" element={<EnhancementsWorkspace />} />
          <Route path="/projects/:projectId/configuration" element={<ConfigurationWorkspace />} />
          <Route path="/projects/:projectId/snapshots" element={<SnapshotsWorkspace />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <UserHelp />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
