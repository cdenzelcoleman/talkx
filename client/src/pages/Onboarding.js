import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { submitOnboarding } from '../services/authService';
import Button from '../components/common/Button';

// I'm creating the Onboarding page for new users to set up their bio
// This is only shown once after initial OAuth signup

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // I'm handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bio.trim()) {
      setError('Please enter a bio to continue');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // I'm submitting the bio to the backend
      const result = await submitOnboarding(bio);

      // I'm updating the user in the Auth context
      updateUser(result.user);

      // I'm redirecting to the feed
      navigate('/feed', { replace: true });
    } catch (err) {
      console.error('Onboarding error:', err);
      setError(err.response?.data?.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* I'm adding the branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to TalkX!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let's set up your profile
          </p>
        </div>

        {/* I'm adding the onboarding form */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl p-8 shadow-xl">
          {/* I'm showing the user info */}
          {user && (
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {user.displayName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{user.username}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* I'm adding the bio textarea */}
            <div className="mb-6">
              <label
                htmlFor="bio"
                className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >
                Tell us about yourself
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio..."
                className="w-full min-h-[120px] p-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                disabled={isSubmitting}
                maxLength={160}
                autoFocus
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {bio.length}/160 characters
              </p>
            </div>

            {/* I'm showing error message if any */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* I'm adding the submit button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="large"
              disabled={isSubmitting || !bio.trim()}
            >
              {isSubmitting ? 'Saving...' : 'Continue'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
