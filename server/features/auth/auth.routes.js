const express = require('express');
const passport = require('../../config/passport');
const authMiddleware = require('../../middleware/auth');
const {
  oauthCallback,
  onboarding,
  getCurrentUser,
  logout,
} = require('./auth.controller');

const router = express.Router();

// I'm defining the Google OAuth routes
// GET /api/auth/google - Initiates Google OAuth flow
router.get('/google', passport.authenticate('google', { session: false }));

// GET /api/auth/callback/google - Google OAuth callback
router.get(
  '/callback/google',
  passport.authenticate('google', { session: false }),
  oauthCallback
);

// I'm defining the GitHub OAuth routes
// GET /api/auth/github - Initiates GitHub OAuth flow
router.get('/github', passport.authenticate('github', { session: false }));

// GET /api/auth/callback/github - GitHub OAuth callback
router.get(
  '/callback/github',
  passport.authenticate('github', { session: false }),
  oauthCallback
);

// I'm defining protected auth routes (require JWT token)
// POST /api/auth/onboarding - Set bio during onboarding
router.post('/onboarding', authMiddleware, onboarding);

// GET /api/auth/me - Get current user
router.get('/me', authMiddleware, getCurrentUser);

// POST /api/auth/logout - Logout
router.post('/logout', authMiddleware, logout);

module.exports = router;
