import React from 'react';

// I'm creating a reusable Button component with different variants
// This ensures consistent styling across the app

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  type = 'button',
  className = '',
  fullWidth = false,
}) => {
  // I'm defining base styles that all buttons share
  const baseStyles = 'font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  // I'm defining variant-specific styles
  const variantStyles = {
    primary: 'bg-primary hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 dark:bg-dark-surface hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-white',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface',
  };

  // I'm defining size-specific styles
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  // I'm combining all styles based on props
  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.medium}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  );
};

export default Button;
