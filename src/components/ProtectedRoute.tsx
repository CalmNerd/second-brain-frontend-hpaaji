import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;