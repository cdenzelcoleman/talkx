const mongoose = require('mongoose');

// I'm defining the Tweet schema with author reference and edit tracking
const tweetSchema = new mongoose.Schema(
  {
    // I'm using a reference to User for the author
    // This allows me to populate author data when fetching tweets
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // I'm indexing for fast author queries
    },
    content: {
      type: String,
      required: true,
      maxlength: 280, // Twitter's classic character limit
      trim: true,
    },
    // I'm denormalizing like count for performance
    // This avoids counting Like documents on every tweet fetch
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // I'm tracking edit status for the "edited" badge
    isEdited: {
      type: Boolean,
      default: false,
    },
    // I'm storing edit history to track changes (optional feature)
    editHistory: [
      {
        content: String,
        editedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // I'm using createdAt for tweet timestamp
  }
);

// I'm creating a compound index on author + createdAt for user tweet history
// This makes "get all tweets by user" queries fast
tweetSchema.index({ author: 1, createdAt: -1 });

// I'm indexing createdAt descending for the Discover feed
// This allows fast reverse-chronological queries
tweetSchema.index({ createdAt: -1 });

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
