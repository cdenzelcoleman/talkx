const { generateToken } = require('../../utils/jwt');
const User = require('../../models/User');
const { AppError } = require('../../middleware/errorHandler');

/**
 * I handle the OAuth callback after successful authentication
 * I generate a JWT and redirect to the frontend with the token
 */
const oauthCallback = async (req, res, next) => {
  try {
    // I'm getting the user from Passport (attached by the strategy)
    const user = req.user;

    if (!user) {
      throw new AppError('Authentication failed', 401);
    }

    // I'm generating a JWT token for the user
    const token = generateToken(user);

    // I'm checking if this is a new user (no bio set yet)
    const isNewUser = !user.bio || user.bio === '';

    // I'm redirecting to the frontend with the token
    // The frontend will handle storing the token and redirecting appropriately
    const redirectUrl = isNewUser
      ? `${process.env.CLIENT_URL}/auth/callback?token=${token}&newUser=true`
      : `${process.env.CLIENT_URL}/auth/callback?token=${token}`;

    res.redirect(redirectUrl);
  } catch (error) {
    next(error);
  }
};

/**
 * I handle the onboarding flow where new users set their bio
 */
const onboarding = async (req, res, next) => {
  try {
    const { bio } = req.body;
    const userId = req.user._id;

    // I'm validating the bio length
    if (!bio || bio.trim() === '') {
      throw new AppError('Bio is required', 400);
    }

    if (bio.length > 160) {
      throw new AppError('Bio must be 160 characters or less', 400);
    }

    // I'm updating the user's bio
    const user = await User.findByIdAndUpdate(
      userId,
      { bio: bio.trim() },
      { new: true } // Return the updated user
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * I return the current authenticated user's data
 * This is used by the frontend to verify the token and get user info
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // I'm getting the user from the auth middleware (req.user)
    const user = req.user;

    res.json({
      success: true,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * I handle user logout
 * Since we're using JWT (stateless), I just send a success response
 * The frontend will clear the token from localStorage
 */
const logout = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  oauthCallback,
  onboarding,
  getCurrentUser,
  logout,
};
