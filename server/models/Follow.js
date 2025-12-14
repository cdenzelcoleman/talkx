const mongoose = require('mongoose');

// I'm defining the Follow schema to track user relationships
// This is a junction table between users
const followSchema = new mongoose.Schema(
  {
    // I'm storing the user who is following
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // I'm storing the user being followed
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// I'm creating a compound unique index on (follower, following)
// This serves three purposes:
// 1. Prevents duplicate follows (unique constraint)
// 2. Speeds up "does A follow B?" queries
// 3. Allows efficient lookup of all users that A follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// I'm adding individual indexes for reverse lookups
// This helps with "get all followers of X" queries
followSchema.index({ follower: 1 });
followSchema.index({ following: 1 });

// I'm preventing users from following themselves at the schema level
followSchema.pre('save', function(next) {
  if (this.follower.equals(this.following)) {
    next(new Error('Users cannot follow themselves'));
  } else {
    next();
  }
});

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;
