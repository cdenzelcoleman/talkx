import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { formatJoinDate } from '../../utils/helpers';
import { followUser, unfollowUser, checkFollowStatus } from '../../services/followService';
import Button from '../common/Button';

// I'm creating a ProfileHeader component to display user profile info
// This includes profile picture, bio, stats, and follow button

const ProfileHeader = ({ profile }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(true);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);

  // I'm checking if this is the current user's own profile
  const isOwnProfile = user && user.id === profile._id;

  // I'm fetching the follow status when the component mounts
  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (user && !isOwnProfile) {
        try {
          const result = await checkFollowStatus(profile._id);
          setIsFollowing(result.isFollowing);
        } catch (error) {
          console.error('Error checking follow status:', error);
        }
      }
      setIsLoadingFollow(false);
    };

    fetchFollowStatus();
  }, [user, profile._id, isOwnProfile]);

  // I'm handling follow/unfollow toggle
  const handleFollowToggle = async () => {
    setIsTogglingFollow(true);
    try {
      if (isFollowing) {
        await unfollowUser(profile._id);
        setIsFollowing(false);
      } else {
        await followUser(profile._id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Failed to update follow status. Please try again.');
    } finally {
      setIsTogglingFollow(false);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      {/* I'm adding a cover photo placeholder */}
      <div className="h-48 bg-gradient-to-r from-primary to-blue-400" />

      {/* I'm adding the profile content */}
      <div className="px-4 pb-4">
        {/* I'm adding the profile picture */}
        <div className="flex justify-between items-start">
          <div className="-mt-16 mb-3">
            <img
              src={profile.profilePicture}
              alt={profile.username}
              className="w-32 h-32 rounded-full border-4 border-white dark:border-dark-bg"
            />
          </div>

          {/* I'm adding the follow button (only if not own profile and user is logged in) */}
          {!isOwnProfile && user && (
            <div className="mt-3">
              <Button
                variant={isFollowing ? 'outline' : 'primary'}
                onClick={handleFollowToggle}
                disabled={isLoadingFollow || isTogglingFollow}
              >
                {isTogglingFollow
                  ? 'Loading...'
                  : isFollowing
                  ? 'Following'
                  : 'Follow'}
              </Button>
            </div>
          )}
        </div>

        {/* I'm adding the user info */}
        <div className="mt-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {profile.displayName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>
        </div>

        {/* I'm adding the bio */}
        {profile.bio && (
          <p className="mt-3 text-gray-900 dark:text-white whitespace-pre-wrap">
            {profile.bio}
          </p>
        )}

        {/* I'm adding the join date */}
        <div className="flex items-center gap-2 mt-3 text-gray-500 dark:text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">{formatJoinDate(profile.createdAt)}</span>
        </div>

        {/* I'm adding the stats */}
        <div className="flex items-center gap-6 mt-4">
          <div className="text-sm">
            <span className="font-bold text-gray-900 dark:text-white">
              {profile.tweetCount}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              {profile.tweetCount === 1 ? 'Tweet' : 'Tweets'}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-bold text-gray-900 dark:text-white">
              {profile.followingCount}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Following</span>
          </div>
          <div className="text-sm">
            <span className="font-bold text-gray-900 dark:text-white">
              {profile.followersCount}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              {profile.followersCount === 1 ? 'Follower' : 'Followers'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
