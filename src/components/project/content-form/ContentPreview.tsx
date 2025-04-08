
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ContentPreviewProps {
  title: string;
  generatedContent: string;
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({ 
  title, 
  generatedContent 
}) => {
  const { theme } = useTheme();
  
  return (
    <>
      {generatedContent ? (
        <div className={`border rounded-md p-6 min-h-[500px] ${
          theme === 'dark' 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
          }`}>{title}</h2>
          <div className={`prose max-w-none ${
            theme === 'dark' ? 'prose-invert text-slate-300' : 'text-slate-700'
          }`}>
            {generatedContent.split('\n').map((line, i) => (
              <p key={i} className={!line ? 'mb-4' : ''}>
                {line || <br />}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className={`border border-dashed rounded-md p-12 text-center ${
          theme === 'dark' 
            ? 'border-slate-700 bg-slate-800/50' 
            : 'border-slate-200 bg-slate-50'
        }`}>
          <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
            No content has been generated yet. Use the AI Assistant to generate content first.
          </p>
        </div>
      )}
    </>
  );
};
