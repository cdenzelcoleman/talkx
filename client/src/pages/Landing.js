import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

// I'm creating the Landing page for unauthenticated users
// This shows the app branding and OAuth login options

const Landing = () => {
  const { isAuthenticated, loading } = useAuth();

  // I'm redirecting to feed if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  // I'm showing a loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  // I'm handling OAuth login by redirecting to the backend OAuth endpoints
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/github`;
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* I'm adding the hero section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">T</span>
                </div>
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
                  TalkX
                </h1>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Happening now
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Join today and share what's on your mind.
              </p>
            </div>

            {/* I'm adding the login section */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Get started
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Sign in with your account to continue
              </p>

              {/* I'm adding OAuth login buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-dark-bg border-2 border-gray-300 dark:border-gray-600 rounded-full font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </button>

                <button
                  onClick={handleGithubLogin}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-900 dark:bg-gray-800 rounded-full font-semibold text-white hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                  Sign in with GitHub
                </button>
              </div>

              {/* I'm adding a disclaimer */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
