const express = require('express');
const authMiddleware = require('../../middleware/auth');
const {
  followUser,
  unfollowUser,
  checkFollowStatus,
} = require('./follows.controller');

const router = express.Router();

// I'm defining follow routes (all protected)
// POST /api/follows/:userId - Follow a user
router.post('/:userId', authMiddleware, followUser);

// DELETE /api/follows/:userId - Unfollow a user
router.delete('/:userId', authMiddleware, unfollowUser);

// GET /api/follows/check/:userId - Check if following a user
router.get('/check/:userId', authMiddleware, checkFollowStatus);

module.exports = router;
