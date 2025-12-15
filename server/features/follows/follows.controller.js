const Follow = require('../../models/Follow');
const { AppError } = require('../../middleware/errorHandler');

/**
 * I create a follow relationship
 * I prevent users from following themselves and duplicate follows
 */
const followUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // I'm preventing self-follows
    if (userId === currentUserId.toString()) {
      throw new AppError('You cannot follow yourself', 400);
    }

    // I'm checking if already following
    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: userId,
    });

    if (existingFollow) {
      throw new AppError('You are already following this user', 409);
    }

    // I'm creating the follow relationship
    const follow = await Follow.create({
      follower: currentUserId,
      following: userId,
    });

    res.status(201).json({
      success: true,
      message: 'Successfully followed user',
      follow,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * I remove a follow relationship (unfollow)
 */
const unfollowUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // I'm finding and deleting the follow relationship
    const follow = await Follow.findOneAndDelete({
      follower: currentUserId,
      following: userId,
    });

    if (!follow) {
      throw new AppError('You are not following this user', 404);
    }

    res.json({
      success: true,
      message: 'Successfully unfollowed user',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * I check if the current user follows a specific user
 * This is used by the frontend to show the correct button state
 */
const checkFollowStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // I'm checking if the follow relationship exists
    const follow = await Follow.findOne({
      follower: currentUserId,
      following: userId,
    });

    res.json({
      success: true,
      isFollowing: !!follow,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  checkFollowStatus,
};
