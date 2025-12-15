const Like = require('../../models/Like');
const Tweet = require('../../models/Tweet');
const { AppError } = require('../../middleware/errorHandler');

/**
 * I create a like on a tweet
 * I prevent duplicate likes and increment the tweet's like count
 */
const likeTweet = async (req, res, next) => {
  try {
    const { tweetId } = req.params;
    const userId = req.user._id;

    // I'm checking if the tweet exists
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      throw new AppError('Tweet not found', 404);
    }

    // I'm checking if already liked
    const existingLike = await Like.findOne({
      user: userId,
      tweet: tweetId,
    });

    if (existingLike) {
      throw new AppError('You have already liked this tweet', 409);
    }

    // I'm creating the like
    const like = await Like.create({
      user: userId,
      tweet: tweetId,
    });

    // I'm incrementing the tweet's like count
    await Tweet.findByIdAndUpdate(tweetId, { $inc: { likeCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Tweet liked successfully',
      like,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * I remove a like from a tweet (unlike)
 * I decrement the tweet's like count
 */
const unlikeTweet = async (req, res, next) => {
  try {
    const { tweetId } = req.params;
    const userId = req.user._id;

    // I'm finding and deleting the like
    const like = await Like.findOneAndDelete({
      user: userId,
      tweet: tweetId,
    });

    if (!like) {
      throw new AppError('You have not liked this tweet', 404);
    }

    // I'm decrementing the tweet's like count
    await Tweet.findByIdAndUpdate(tweetId, { $inc: { likeCount: -1 } });

    res.json({
      success: true,
      message: 'Tweet unliked successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * I check if the current user has liked a specific tweet
 * This is used by the frontend to show the correct heart state
 */
const checkLikeStatus = async (req, res, next) => {
  try {
    const { tweetId } = req.params;
    const userId = req.user._id;

    // I'm checking if the like exists
    const like = await Like.findOne({
      user: userId,
      tweet: tweetId,
    });

    res.json({
      success: true,
      isLiked: !!like,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  likeTweet,
  unlikeTweet,
  checkLikeStatus,
};
