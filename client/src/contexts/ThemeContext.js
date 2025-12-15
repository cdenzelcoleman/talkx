import React, { createContext, useState, useEffect, useContext } from 'react';

// I'm creating a context to manage theme (light/dark mode) globally
// This syncs with localStorage and applies the theme to the document

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // I'm checking localStorage for saved theme preference, defaulting to light
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // I'm applying the theme class to the document element whenever it changes
  // This enables Tailwind's dark mode via the 'dark' class
  useEffect(() => {
    const root = window.document.documentElement;

    // I'm removing both classes first to avoid conflicts
    root.classList.remove('light', 'dark');

    // I'm adding the current theme class
    root.classList.add(theme);

    // I'm saving the preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // I'm providing a toggle function to switch between light and dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // I'm providing a setter for explicit theme changes
  const setThemeMode = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
    }
  };

  // I'm providing theme state and control functions to the app
  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// I'm creating a custom hook for easy access to theme context
// This prevents the need to import useContext and ThemeContext everywhere
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
