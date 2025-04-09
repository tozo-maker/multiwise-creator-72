
import React from 'react';
import { useLocation } from "react-router-dom";

export const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">404</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">Oops! Page not found</p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
          Could not find the page: {location.pathname}
        </p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
