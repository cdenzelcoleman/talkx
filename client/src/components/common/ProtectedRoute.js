import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// I'm creating a ProtectedRoute component to guard authenticated routes
// This redirects to landing if user is not authenticated

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, isInitialized } = useAuth();

  // I'm showing nothing while checking authentication
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  // I'm redirecting to landing if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // I'm rendering the protected content
  return children;
};

export default ProtectedRoute;
