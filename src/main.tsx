
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { UnifiedAuthProvider } from './contexts/UnifiedAuthContext';
import { AuthProfileProvider } from './contexts/AuthProfileContext';
import { Toaster } from '@/components/ui/toaster';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <UnifiedAuthProvider>
      <AuthProfileProvider>
        <ThemeProvider>
          <App />
          <Toaster />
        </ThemeProvider>
      </AuthProfileProvider>
    </UnifiedAuthProvider>
  </BrowserRouter>
);
