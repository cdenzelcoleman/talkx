import React, { useEffect } from 'react';
import Button from './Button';

// I'm creating a reusable Modal component for dialogs and confirmations
// This provides a consistent modal experience across the app

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  showActions = true,
}) => {
  // I'm preventing body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // I'm cleaning up on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // I'm handling escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // I'm not rendering anything if modal is closed
  if (!isOpen) return null;

  // I'm handling backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      {/* I'm creating the modal container */}
      <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* I'm adding the modal header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>

        {/* I'm adding the modal content */}
        <div className="px-6 py-4 text-gray-700 dark:text-gray-300">
          {children}
        </div>

        {/* I'm adding action buttons if enabled */}
        {showActions && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              {cancelText}
            </Button>
            {onConfirm && (
              <Button variant={confirmVariant} onClick={onConfirm}>
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
