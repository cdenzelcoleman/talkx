import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

// I'm creating a Layout component to wrap all authenticated pages
// This provides consistent structure and theming across the app

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* I'm creating a container with max-width for better readability on large screens */}
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* I'm adding the main content area */}
          <main className="flex-1 min-h-screen border-x border-gray-200 dark:border-gray-700">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
