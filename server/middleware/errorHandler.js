const config = require('../config/environment');

/**
 * I'm creating a global error handler middleware
 * This catches any errors thrown in route handlers and formats them consistently
 * I show detailed errors in development but hide them in production
 */
const errorHandler = (err, req, res, next) => {
  // I'm logging the error for debugging (in dev, this goes to console)
  console.error('❌ Error:', err);

  // I'm determining the status code
  // If the error has a status, use it; otherwise default to 500
  const statusCode = err.statusCode || 500;

  // I'm creating a consistent error response format
  const response = {
    success: false,
    message: err.message || 'Something went wrong',
  };

  // I'm only including the error stack in development
  // In production, I don't want to leak implementation details
  if (config.server.nodeEnv === 'development') {
    response.error = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * I'm creating a helper to create errors with status codes
 * This makes it easy to throw errors with the correct HTTP status
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  AppError,
};
