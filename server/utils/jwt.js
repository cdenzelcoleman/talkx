const jwt = require('jsonwebtoken');
const config = require('../config/environment');

// I'm creating utility functions for JWT token management
// This centralizes token generation and verification logic

/**
 * I generate a JWT token for a user
 * The payload includes userId, username, and profilePicture for quick access
 * I'm not including sensitive data like email or OAuth IDs
 */
const generateToken = (user) => {
  const payload = {
    userId: user._id.toString(),
    username: user.username,
    profilePicture: user.profilePicture,
  };

  // I'm signing the token with the secret and setting expiration
  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  return token;
};

/**
 * I verify a JWT token and return the decoded payload
 * If the token is invalid or expired, I throw an error
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded;
  } catch (error) {
    // I'm re-throwing with a clearer error message
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw error;
    }
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
