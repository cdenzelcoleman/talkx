// I'm loading environment variables first, before anything else
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');
const config = require('./config/environment');

// I'm importing route modules
const authRoutes = require('./features/auth/auth.routes');
const userRoutes = require('./features/users/users.routes');
const tweetRoutes = require('./features/tweets/tweets.routes');
const followRoutes = require('./features/follows/follows.routes');
const likeRoutes = require('./features/likes/likes.routes');

// I'm creating the Express app
const app = express();

// I'm connecting to MongoDB
connectDB();

// I'm setting up middleware
app.use(cors({
  origin: config.client.url,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// I'm mounting API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tweets', tweetRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/likes', likeRoutes);

// I'm adding a health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TalkX API is running',
    timestamp: new Date().toISOString(),
  });
});

// I'm adding a 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// I'm adding the global error handler (must be last)
app.use(errorHandler);

// I'm starting the server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.server.nodeEnv}`);
  console.log(`📱 Client URL: ${config.client.url}`);
});

module.exports = app;
