const mongoose = require('mongoose');

// I'm defining the Like schema to track tweet likes
// This is a junction table between users and tweets
const likeSchema = new mongoose.Schema(
  {
    // I'm storing which user liked the tweet
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // I'm storing which tweet was liked
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tweet',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// I'm creating a compound unique index on (user, tweet)
// This serves three purposes:
// 1. Prevents duplicate likes (unique constraint)
// 2. Speeds up "has user X liked tweet Y?" queries
// 3. Allows efficient lookup of all tweets a user has liked
likeSchema.index({ user: 1, tweet: 1 }, { unique: true });

// I'm adding individual indexes for lookups
// This helps with "get all likes for tweet X" queries
likeSchema.index({ user: 1 });
likeSchema.index({ tweet: 1 });

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
