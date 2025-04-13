
import { Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Dashboard from './pages/dashboard/Dashboard'
import Analytics from './pages/analytics/Analytics'
import { ThemeProvider } from './contexts/ThemeContext'
import Projects from './pages/projects/Projects'
import ProjectWorkspace from './pages/projects/ProjectWorkspace'
import { EnhancedProjectWizard } from './components/project-creation/EnhancedProjectWizard'
import ContentWorkspace from './pages/projects/ContentWorkspace'
import { ProjectCreationWizard } from './components/project-creation/ProjectCreationWizard'
import CreateProject from './pages/projects/CreateProject'
import KnowledgeBase from './pages/projects/KnowledgeBase'
import ConfigurationWorkspace from './pages/projects/ConfigurationWorkspace'
import ContentCreation from './pages/projects/ContentCreation'
import EnhancedContentCreation from './pages/projects/EnhancedContentCreation'
import Help from './pages/help/Help'
import ContentView from './pages/projects/ContentView'
import OutlineWorkspace from './pages/projects/OutlineWorkspace'
import KnowledgeBasePage from './pages/knowledge/KnowledgeBasePage'

function App() {
  // Handler for project creation completion
  const handleProjectCreationComplete = (projectId: string) => {
    console.log('Project created:', projectId);
    window.location.href = `/projects/${projectId}`;
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/new" element={<CreateProject />} />
      <Route path="/projects/create" element={
        <ProjectCreationWizard 
          templateId="default" 
          onComplete={handleProjectCreationComplete} 
        />
      } />
      <Route path="/projects/wizard" element={
        <EnhancedProjectWizard 
          onComplete={handleProjectCreationComplete} 
        />
      } />
      <Route path="/projects/:projectId" element={<ProjectWorkspace />} />
      <Route path="/projects/:projectId/content" element={<ContentWorkspace />} />
      <Route path="/projects/:projectId/content/create" element={<ContentCreation />} />
      <Route path="/projects/:projectId/content/enhanced" element={<EnhancedContentCreation />} />
      <Route path="/projects/:projectId/content/:contentId" element={<ContentView />} />
      <Route path="/projects/:projectId/knowledge-base" element={<KnowledgeBase />} />
      <Route path="/projects/:projectId/configuration" element={<ConfigurationWorkspace />} />
      <Route path="/projects/:projectId/outline" element={<OutlineWorkspace />} />
      <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
      <Route path="/help" element={<Help />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
