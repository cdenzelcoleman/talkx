import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Landing from './pages/Landing';
import AuthCallback from './pages/AuthCallback';
import Onboarding from './pages/Onboarding';
import Feed from './pages/Feed';
import Profile from './pages/Profile';

// I'm creating the main App component with routing
// This sets up all context providers and route definitions

function App() {
  return (
    // I'm wrapping the app with ThemeProvider for dark mode support
    <ThemeProvider>
      {/* I'm wrapping the app with AuthProvider for authentication */}
      <AuthProvider>
        {/* I'm setting up the router */}
        <Router>
          <Routes>
            {/* I'm adding public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* I'm adding protected routes that require authentication */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:username"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* I'm adding a catch-all redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
