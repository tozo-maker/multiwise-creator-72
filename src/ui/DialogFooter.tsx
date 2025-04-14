
import React from 'react';

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
      {children}
    </div>
  );
}
