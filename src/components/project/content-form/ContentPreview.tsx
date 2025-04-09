
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ContentPreviewProps {
  content: string;
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({ content }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!content) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        Your content preview will appear here
      </div>
    );
  }

  // Very simple markdown-like rendering
  const renderContent = () => {
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mb-4">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mb-3 mt-4">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium mb-2 mt-3">{line.substring(4)}</h3>;
      } else if (line.trim() === '') {
        return <div key={index} className="h-4"></div>;
      } else {
        return <p key={index} className="mb-2">{line}</p>;
      }
    });
  };

  return (
    <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
      {renderContent()}
    </div>
  );
};

export default ContentPreview;
