
import React from 'react';

interface ContentPreviewProps {
  title: string;
  generatedContent: string;
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({ 
  title, 
  generatedContent 
}) => {
  return (
    <>
      {generatedContent ? (
        <div className="border rounded-md p-6 bg-background min-h-[500px]">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {generatedContent.split('\n').map((line, i) => (
              <p key={i} className={!line ? 'mb-4' : ''}>
                {line || <br />}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-border rounded-md p-12 text-center">
          <p className="text-muted-foreground">
            No content has been generated yet. Use the AI Assistant to generate content first.
          </p>
        </div>
      )}
    </>
  );
};
