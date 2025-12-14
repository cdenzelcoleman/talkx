const mongoose = require('mongoose');

// I'm defining the User schema with all required fields from the design
// Using timestamps for automatic createdAt/updatedAt tracking
const userSchema = new mongoose.Schema(
  {
    // I'm storing OAuth provider to handle multiple auth methods
    oauthProvider: {
      type: String,
      required: true,
      enum: ['google', 'github'],
    },
    // I'm storing the provider's unique ID for this user
    oauthId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // I'm indexing username for fast lookups and uniqueness
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    profilePicture: {
      type: String,
      required: true, // OAuth will always provide this
    },
    bio: {
      type: String,
      maxlength: 160,
      default: '', // I'm defaulting to empty string for new users
    },
    // I'm denormalizing tweet count for performance
    // This avoids expensive count queries when displaying profiles
    tweetCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// I'm creating a compound index on oauthProvider + oauthId
// This ensures a user can't sign up twice with the same OAuth account
userSchema.index({ oauthProvider: 1, oauthId: 1 }, { unique: true });

// I'm adding a method to convert user to safe JSON for responses
// This removes sensitive fields that shouldn't be exposed
userSchema.methods.toSafeObject = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    profilePicture: this.profilePicture,
    bio: this.bio,
    tweetCount: this.tweetCount,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
