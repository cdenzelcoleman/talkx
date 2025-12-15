import api from './api';

// I'm creating service functions for all like-related API calls
// This handles liking/unliking tweets and checking like status

/**
 * I like a tweet by its tweet ID
 */
export const likeTweet = async (tweetId) => {
  const response = await api.post(`/likes/${tweetId}`);
  return response.data;
};

/**
 * I unlike a tweet by its tweet ID
 */
export const unlikeTweet = async (tweetId) => {
  const response = await api.delete(`/likes/${tweetId}`);
  return response.data;
};

/**
 * I check if the current user has liked a tweet
 * Returns { isLiked: true/false }
 */
export const checkLikeStatus = async (tweetId) => {
  const response = await api.get(`/likes/${tweetId}/status`);
  return response.data;
};
