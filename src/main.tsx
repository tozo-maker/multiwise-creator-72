
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { UnifiedAuthProvider } from './contexts/UnifiedAuthContext';
import { AuthProfileProvider } from './contexts/AuthProfileContext';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <UnifiedAuthProvider>
      <AuthProfileProvider>
        <App />
      </AuthProfileProvider>
    </UnifiedAuthProvider>
  </BrowserRouter>
);
