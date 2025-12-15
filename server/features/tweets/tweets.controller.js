const Tweet = require('../../models/Tweet');
const User = require('../../models/User');
const Follow = require('../../models/Follow');
const Like = require('../../models/Like');
const { AppError } = require('../../middleware/errorHandler');

/**
 * I create a new tweet
 * I validate content length and increment the user's tweet count
 */
const createTweet = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;

    // I'm validating the content
    if (!content || content.trim() === '') {
      throw new AppError('Tweet content is required', 400);
    }

    if (content.length > 280) {
      throw new AppError('Tweet must be 280 characters or less', 400);
    }

    // I'm creating the tweet
    const tweet = await Tweet.create({
      author: userId,
      content: content.trim(),
    });

    // I'm incrementing the user's tweet count
    await User.findByIdAndUpdate(userId, { $inc: { tweetCount: 1 } });

    // I'm populating the author data before returning
    await tweet.populate('author');

    res.status(201).json({
      success: true,
      message: 'Tweet created successfully',
      tweet,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * I get the Following feed (tweets from users the current user follows)
 * I return tweets in reverse chronological order
 */
const getFollowingFeed = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // I'm getting all users that the current user follows
    const following = await Follow.find({ follower: userId }).select('following');
    const followingIds = following.map((f) => f.following);

    // I'm fetching tweets from those users, sorted by newest first
    const tweets = await Tweet.find({ author: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .populate('author')
      .limit(50); // I'm limiting to 50 tweets for performance

    // I'm checking which tweets the current user has liked
    const tweetIds = tweets.map((t) => t._id);
    const likes = await Like.find({ user: userId, tweet: { $in: tweetIds } });
    const likedTweetIds = new Set(likes.map((l) => l.tweet.toString()));

    // I'm adding a 'liked' field to each tweet
    const tweetsWithLikeStatus = tweets.map((tweet) => ({
      ...tweet.toObject(),
      liked: likedTweetIds.has(tweet._id.toString()),
    }));

    res.json({
      success: true,
      tweets: tweetsWithLikeStatus,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * I get the Discover feed (all tweets)
 * I return tweets in reverse chronological order
 */
const getDiscoverFeed = async (req, res, next) => {
  try {
    // I'm fetching all tweets, sorted by newest first
    const tweets = await Tweet.find()
      .sort({ createdAt: -1 })
      .populate('author')
      .limit(50); // I'm limiting to 50 tweets for performance

    // I'm checking if the user is authenticated to show like status
    if (req.user) {
      const userId = req.user._id;
      const tweetIds = tweets.map((t) => t._id);
      const likes = await Like.find({ user: userId, tweet: { $in: tweetIds } });
      const likedTweetIds = new Set(likes.map((l) => l.tweet.toString()));

      // I'm adding a 'liked' field to each tweet
      const tweetsWithLikeStatus = tweets.map((tweet) => ({
        ...tweet.toObject(),
        liked: likedTweetIds.has(tweet._id.toString()),
      }));

      return res.json({
        success: true,
        tweets: tweetsWithLikeStatus,
      });
    }

    // I'm returning tweets without like status if not authenticated
    res.json({
      success: true,
      tweets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * I edit an existing tweet
 * I verify ownership and track the edit in history
 */
const editTweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    // I'm validating the content
    if (!content || content.trim() === '') {
      throw new AppError('Tweet content is required', 400);
    }

    if (content.length > 280) {
      throw new AppError('Tweet must be 280 characters or less', 400);
    }

    // I'm finding the tweet and verifying ownership
    const tweet = await Tweet.findById(id);

    if (!tweet) {
      throw new AppError('Tweet not found', 404);
    }

    if (tweet.author.toString() !== userId.toString()) {
      throw new AppError('You can only edit your own tweets', 403);
    }

    // I'm saving the old content to edit history
    tweet.editHistory.push({
      content: tweet.content,
      editedAt: new Date(),
    });

    // I'm updating the tweet
    tweet.content = content.trim();
    tweet.isEdited = true;
    tweet.updatedAt = new Date();

    await tweet.save();
    await tweet.populate('author');

    res.json({
      success: true,
      message: 'Tweet updated successfully',
      tweet,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * I delete a tweet
 * I verify ownership and decrement the user's tweet count
 */
const deleteTweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // I'm finding the tweet and verifying ownership
    const tweet = await Tweet.findById(id);

    if (!tweet) {
      throw new AppError('Tweet not found', 404);
    }

    if (tweet.author.toString() !== userId.toString()) {
      throw new AppError('You can only delete your own tweets', 403);
    }

    // I'm deleting the tweet
    await Tweet.findByIdAndDelete(id);

    // I'm decrementing the user's tweet count
    await User.findByIdAndUpdate(userId, { $inc: { tweetCount: -1 } });

    // I'm also deleting all likes associated with this tweet
    await Like.deleteMany({ tweet: id });

    res.json({
      success: true,
      message: 'Tweet deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTweet,
  getFollowingFeed,
  getDiscoverFeed,
  editTweet,
  deleteTweet,
};
