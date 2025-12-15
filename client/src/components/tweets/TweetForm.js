import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { validateTweetContent, getCharCountColor } from '../../utils/helpers';
import { createTweet, editTweet } from '../../services/tweetService';
import Button from '../common/Button';
import Modal from '../common/Modal';

// I'm creating a TweetForm component for composing and editing tweets
// This includes character count, validation, and modal dialog

const TweetForm = ({ isOpen, onClose, onSuccess, editingTweet = null }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // I'm setting the content if we're editing an existing tweet
  useEffect(() => {
    if (editingTweet) {
      setContent(editingTweet.content);
    } else {
      setContent('');
    }
    setError(null);
  }, [editingTweet, isOpen]);

  // I'm handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // I'm validating the content
    const validationError = validateTweetContent(content);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let result;
      if (editingTweet) {
        // I'm editing an existing tweet
        result = await editTweet(editingTweet._id, content);
      } else {
        // I'm creating a new tweet
        result = await createTweet(content);
      }

      // I'm resetting the form
      setContent('');
      onClose();

      // I'm notifying the parent component
      if (onSuccess) {
        onSuccess(result.tweet);
      }
    } catch (err) {
      console.error('Error submitting tweet:', err);
      setError(err.response?.data?.message || 'Failed to submit tweet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // I'm handling modal close
  const handleClose = () => {
    if (!isSubmitting) {
      setContent('');
      setError(null);
      onClose();
    }
  };

  // I'm computing character count and color
  const charCount = content.length;
  const charCountColor = getCharCountColor(charCount);
  const isValid = validateTweetContent(content) === null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingTweet ? 'Edit Tweet' : 'Create Tweet'}
      showActions={false}
    >
      <form onSubmit={handleSubmit}>
        {/* I'm adding the user info */}
        <div className="flex gap-3 mb-4">
          <img
            src={user?.profilePicture}
            alt={user?.username}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <p className="font-bold text-gray-900 dark:text-white">
              {user?.displayName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{user?.username}
            </p>
          </div>
        </div>

        {/* I'm adding the textarea for tweet content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full min-h-[120px] p-3 text-lg bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          disabled={isSubmitting}
          autoFocus
        />

        {/* I'm adding character count */}
        <div className="flex items-center justify-between mt-3">
          <span className={`text-sm font-medium ${charCountColor}`}>
            {charCount}/280
          </span>

          {/* I'm adding error message */}
          {error && (
            <span className="text-sm text-red-500 dark:text-red-400">
              {error}
            </span>
          )}
        </div>

        {/* I'm adding action buttons */}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Posting...' : editingTweet ? 'Save' : 'Tweet'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TweetForm;
