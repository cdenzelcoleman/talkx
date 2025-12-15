import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../common/Button';

// I'm creating the top navigation bar for the app
// This includes branding, theme toggle, and user menu

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // I'm handling logout and redirecting to home
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // I'm toggling the user dropdown menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* I'm adding the logo/brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              TalkX
            </span>
          </Link>

          {/* I'm adding the right side actions */}
          <div className="flex items-center gap-4">
            {/* I'm adding the theme toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                // I'm showing moon icon for light mode (clicking switches to dark)
                <svg
                  className="w-5 h-5 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                // I'm showing sun icon for dark mode (clicking switches to light)
                <svg
                  className="w-5 h-5 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            {/* I'm adding the user profile menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors"
                >
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white hidden sm:block">
                    @{user.username}
                  </span>
                </button>

                {/* I'm adding the dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-surface rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                    <Link
                      to={`/profile/${user.username}`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-bg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* I'm adding a click-away listener to close the menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
