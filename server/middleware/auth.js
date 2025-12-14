const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * I'm creating middleware to protect routes that require authentication
 * I check for a JWT token in the Authorization header
 * If valid, I attach the full user object to req.user
 * If invalid, I return a 401 error
 */
const authMiddleware = async (req, res, next) => {
  try {
    // I'm extracting the token from the Authorization header
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in.',
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // I'm verifying the token and extracting the payload
    const decoded = verifyToken(token);

    // I'm fetching the full user object from the database
    // This ensures I have the latest user data, not just what's in the token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please log in again.',
      });
    }

    // I'm attaching the user to the request object
    // Controllers can now access req.user
    req.user = user;
    next();

  } catch (error) {
    // I'm handling token verification errors
    if (error.message === 'Token has expired') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.',
      });
    } else if (error.message === 'Invalid token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Authentication error.',
      });
    }
  }
};

module.exports = authMiddleware;
