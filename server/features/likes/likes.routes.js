const express = require('express');
const authMiddleware = require('../../middleware/auth');
const {
  likeTweet,
  unlikeTweet,
  checkLikeStatus,
} = require('./likes.controller');

const router = express.Router();

// I'm defining like routes (all protected)
// POST /api/likes/:tweetId - Like a tweet
router.post('/:tweetId', authMiddleware, likeTweet);

// DELETE /api/likes/:tweetId - Unlike a tweet
router.delete('/:tweetId', authMiddleware, unlikeTweet);

// GET /api/likes/check/:tweetId - Check if liked a tweet
router.get('/check/:tweetId', authMiddleware, checkLikeStatus);

module.exports = router;
