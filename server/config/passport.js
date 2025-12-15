const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const config = require('./environment');

/**
 * I'm configuring Passport to use Google OAuth
 * When a user signs in with Google, I'll find or create their User document
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: config.oauth.google.clientID,
      clientSecret: config.oauth.google.clientSecret,
      callbackURL: config.oauth.google.callbackURL,
      // I'm requesting these scopes from Google
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // I'm extracting user data from the Google profile
        const email = profile.emails[0].value;
        const username = profile.displayName || email.split('@')[0];
        const profilePicture = profile.photos[0].value;

        // I'm checking if this user already exists
        let user = await User.findOne({
          oauthProvider: 'google',
          oauthId: profile.id,
        });

        if (user) {
          // I'm returning the existing user
          return done(null, user);
        }

        // I'm creating a new user if they don't exist
        user = await User.create({
          oauthProvider: 'google',
          oauthId: profile.id,
          username,
          email,
          profilePicture,
          bio: '', // I'll set this during onboarding
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

/**
 * I'm configuring Passport to use GitHub OAuth
 * Similar to Google, but with GitHub's API structure
 */
passport.use(
  new GitHubStrategy(
    {
      clientID: config.oauth.github.clientID,
      clientSecret: config.oauth.github.clientSecret,
      callbackURL: config.oauth.github.callbackURL,
      // I'm requesting these scopes from GitHub
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // I'm extracting user data from the GitHub profile
        const email = profile.emails[0].value;
        const username = profile.username;
        const profilePicture = profile.photos[0].value;

        // I'm checking if this user already exists
        let user = await User.findOne({
          oauthProvider: 'github',
          oauthId: profile.id,
        });

        if (user) {
          // I'm returning the existing user
          return done(null, user);
        }

        // I'm creating a new user if they don't exist
        user = await User.create({
          oauthProvider: 'github',
          oauthId: profile.id,
          username,
          email,
          profilePicture,
          bio: '', // I'll set this during onboarding
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// I'm not using sessions, so these are no-ops
// We're using JWT tokens instead
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
