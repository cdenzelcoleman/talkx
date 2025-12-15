import api from './api';

// I'm creating service functions for all auth-related API calls
// This keeps API logic separate from components

/**
 * I verify the current JWT token and get user data
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * I submit the user's bio during onboarding
 */
export const submitOnboarding = async (bio) => {
  const response = await api.post('/auth/onboarding', { bio });
  return response.data;
};

/**
 * I logout the user (clear token)
 */
export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
