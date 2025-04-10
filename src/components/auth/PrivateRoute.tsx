
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const PrivateRoute = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Allow access to dashboard without authentication
  if (location.pathname === '/dashboard') {
    return <Outlet />;
  }
  
  // For other protected routes, redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // Otherwise, render the protected route
  return <Outlet />;
};

export default PrivateRoute;
