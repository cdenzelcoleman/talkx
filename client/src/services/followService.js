import api from './api';

// I'm creating service functions for all follow-related API calls
// This handles following/unfollowing users and checking follow status

/**
 * I follow a user by their user ID
 */
export const followUser = async (userId) => {
  const response = await api.post(`/follows/${userId}`);
  return response.data;
};

/**
 * I unfollow a user by their user ID
 */
export const unfollowUser = async (userId) => {
  const response = await api.delete(`/follows/${userId}`);
  return response.data;
};

/**
 * I check if the current user is following another user
 * Returns { isFollowing: true/false }
 */
export const checkFollowStatus = async (userId) => {
  const response = await api.get(`/follows/${userId}/status`);
  return response.data;
};
