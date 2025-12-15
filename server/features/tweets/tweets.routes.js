const express = require('express');
const authMiddleware = require('../../middleware/auth');
const {
  createTweet,
  getFollowingFeed,
  getDiscoverFeed,
  editTweet,
  deleteTweet,
} = require('./tweets.controller');

const router = express.Router();

// I'm defining tweet routes
// POST /api/tweets - Create a new tweet (protected)
router.post('/', authMiddleware, createTweet);

// GET /api/tweets/feed/following - Get Following feed (protected)
router.get('/feed/following', authMiddleware, getFollowingFeed);

// GET /api/tweets/feed/discover - Get Discover feed (public, but shows like status if authenticated)
// I'm making this route flexible: it works without auth but enhances with auth
router.get('/feed/discover', (req, res, next) => {
  // I'm attaching auth middleware but not requiring it
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authMiddleware(req, res, next);
  }
  next();
}, getDiscoverFeed);

// PATCH /api/tweets/:id - Edit a tweet (protected)
router.patch('/:id', authMiddleware, editTweet);

// DELETE /api/tweets/:id - Delete a tweet (protected)
router.delete('/:id', authMiddleware, deleteTweet);

module.exports = router;
