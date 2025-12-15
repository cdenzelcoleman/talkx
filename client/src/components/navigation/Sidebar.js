import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';

// I'm creating a sidebar navigation component
// This provides quick access to main app sections

const Sidebar = ({ onTweetClick }) => {
  const { user } = useAuth();

  // I'm defining navigation items with icons and labels
  const navItems = [
    {
      name: 'Home',
      path: '/feed',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: 'Profile',
      path: `/profile/${user?.username}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 h-screen sticky top-16 px-4 py-6 hidden lg:block">
      {/* I'm adding navigation links */}
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-full transition-colors ${
                isActive
                  ? 'bg-primary bg-opacity-10 text-primary font-bold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface'
              }`
            }
          >
            {item.icon}
            <span className="text-xl">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* I'm adding a tweet button */}
      <div className="mt-6">
        <Button
          variant="primary"
          fullWidth
          size="large"
          onClick={onTweetClick}
        >
          Tweet
        </Button>
      </div>

      {/* I'm adding user info at the bottom */}
      {user && (
        <div className="absolute bottom-6 left-4 right-4">
          <div className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors cursor-pointer">
            <img
              src={user.profilePicture}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user.displayName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                @{user.username}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
