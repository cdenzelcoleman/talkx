const express = require('express');
const { getUserProfile } = require('./users.controller');

const router = express.Router();

// I'm defining user routes
// GET /api/users/:id - Get user profile (public)
router.get('/:id', getUserProfile);

module.exports = router;
