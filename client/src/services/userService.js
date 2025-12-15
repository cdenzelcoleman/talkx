import api from './api';

// I'm creating service functions for all user-related API calls
// This handles user profile data fetching

/**
 * I get a user's profile by their username
 * Returns profile data including tweets, following/followers count
 */
export const getUserProfile = async (username) => {
  const response = await api.get(`/users/${username}`);
  return response.data;
};
