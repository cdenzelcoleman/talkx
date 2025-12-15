const User = require('../../models/User');
const { AppError } = require('../../middleware/errorHandler');

/**
 * I get a user's profile by their ID
 * This is used for the profile page
 */
const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    // I'm finding the user
    const user = await User.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // I'm returning the safe user object (no sensitive data)
    res.json({
      success: true,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
};
