import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatRelativeTime } from '../../utils/helpers';
import { likeTweet, unlikeTweet } from '../../services/likeService';
import { deleteTweet } from '../../services/tweetService';
import Modal from '../common/Modal';
import Button from '../common/Button';

// I'm creating a TweetCard component to display individual tweets
// This includes author info, content, like button, and action menu

const TweetCard = ({ tweet, onEdit, onDelete, onLikeToggle }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(tweet.isLiked || false);
  const [likeCount, setLikeCount] = useState(tweet.likeCount || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // I'm checking if the current user is the author
  const isAuthor = user && user.id === tweet.author._id;

  // I'm handling like/unlike toggle
  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        await unlikeTweet(tweet._id);
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await likeTweet(tweet._id);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }

      // I'm notifying the parent component if callback is provided
      if (onLikeToggle) {
        onLikeToggle(tweet._id, !isLiked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // I'm handling tweet deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTweet(tweet._id);
      setShowDeleteModal(false);

      // I'm notifying the parent component
      if (onDelete) {
        onDelete(tweet._id);
      }
    } catch (error) {
      console.error('Error deleting tweet:', error);
      alert('Failed to delete tweet. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
      <div className="flex gap-3">
        {/* I'm adding the author's profile picture */}
        <Link to={`/profile/${tweet.author.username}`}>
          <img
            src={tweet.author.profilePicture}
            alt={tweet.author.username}
            className="w-12 h-12 rounded-full"
          />
        </Link>

        <div className="flex-1 min-w-0">
          {/* I'm adding the tweet header with author info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Link
                to={`/profile/${tweet.author.username}`}
                className="font-bold text-gray-900 dark:text-white hover:underline truncate"
              >
                {tweet.author.displayName}
              </Link>
              <Link
                to={`/profile/${tweet.author.username}`}
                className="text-gray-500 dark:text-gray-400 text-sm truncate"
              >
                @{tweet.author.username}
              </Link>
              <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {formatRelativeTime(tweet.createdAt)}
              </span>
              {/* I'm showing an "edited" indicator if the tweet was edited */}
              {tweet.isEdited && (
                <span className="text-gray-400 dark:text-gray-500 text-xs italic">
                  (edited)
                </span>
              )}
            </div>

            {/* I'm adding a menu button for tweet actions (only for author) */}
            {isAuthor && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {/* I'm showing the dropdown menu */}
                {showMenu && (
                  <>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-surface rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onEdit(tweet);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setShowDeleteModal(true);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-bg"
                      >
                        Delete
                      </button>
                    </div>
                    {/* I'm adding a click-away listener */}
                    <div
                      className="fixed inset-0 z-0"
                      onClick={() => setShowMenu(false)}
                    />
                  </>
                )}
              </div>
            )}
          </div>

          {/* I'm adding the tweet content */}
          <p className="text-gray-900 dark:text-white mt-2 whitespace-pre-wrap break-words">
            {tweet.content}
          </p>

          {/* I'm adding action buttons */}
          <div className="flex items-center gap-6 mt-3">
            {/* I'm adding the like button */}
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-2 group ${
                isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
              }`}
              disabled={!user}
            >
              <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900 transition-colors">
                <svg
                  className="w-5 h-5 group-hover:text-red-500 transition-colors"
                  fill={isLiked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <span className="text-sm">{likeCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* I'm adding the delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Tweet?"
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
      >
        <p>This action cannot be undone. Your tweet will be permanently deleted.</p>
      </Modal>
    </article>
  );
};

export default TweetCard;
