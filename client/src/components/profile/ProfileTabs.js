import React from 'react';

// I'm creating a ProfileTabs component for the profile page
// For MVP, we only have a "Tweets" tab, but this structure allows easy expansion

const ProfileTabs = ({ activeTab = 'tweets', onTabChange }) => {
  // I'm defining available tabs
  const tabs = [
    { id: 'tweets', label: 'Tweets' },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 py-4 text-center font-semibold transition-colors relative ${
              activeTab === tab.id
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface'
            }`}
          >
            {tab.label}
            {/* I'm adding an active indicator bar */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;
