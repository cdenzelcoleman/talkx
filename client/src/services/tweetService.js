import api from './api';

// I'm creating service functions for all tweet-related API calls
// This centralizes tweet operations and keeps components clean

/**
 * I create a new tweet
 */
export const createTweet = async (content) => {
  const response = await api.post('/tweets', { content });
  return response.data;
};

/**
 * I get the Following feed (tweets from users you follow)
 * Requires authentication
 */
export const getFollowingFeed = async () => {
  const response = await api.get('/tweets/following');
  return response.data;
};

/**
 * I get the Discover feed (all tweets, newest first)
 * Works with or without authentication
 */
export const getDiscoverFeed = async () => {
  const response = await api.get('/tweets/discover');
  return response.data;
};

/**
 * I edit an existing tweet
 * Only the author can edit their own tweets
 */
export const editTweet = async (tweetId, content) => {
  const response = await api.put(`/tweets/${tweetId}`, { content });
  return response.data;
};

/**
 * I delete a tweet
 * Only the author can delete their own tweets
 */
export const deleteTweet = async (tweetId) => {
  const response = await api.delete(`/tweets/${tweetId}`);
  return response.data;
};
