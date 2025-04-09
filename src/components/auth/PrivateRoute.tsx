import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const PrivateRoute = () => {
  const { user } = useAuth();
  
  // If the user is not logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // Otherwise, render the protected route
  return <Outlet />;
};

export default PrivateRoute;
