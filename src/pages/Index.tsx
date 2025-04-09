
import React from 'react';
import { Navigate } from 'react-router-dom';

export const Index = () => {
  return <Navigate to="/dashboard" replace />;
};

export default Index;
