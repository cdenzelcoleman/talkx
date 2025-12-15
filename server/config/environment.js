// I'm centralizing all environment variable access here
// This makes it easier to validate and provide defaults
// If any required env var is missing, I'll throw a clear error

// I'm defining critical env vars that must be present
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'CLIENT_URL',
];

// I'm defining OAuth env vars that should be present but won't block startup
const oauthEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
];

// I'm checking for missing critical env vars on startup to fail fast
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

// I'm warning about missing OAuth credentials but not failing
oauthEnvVars.forEach((envVar) => {
  if (!process.env[envVar] || process.env[envVar].includes('your-')) {
    console.warn(`⚠️  Warning: ${envVar} is not configured. OAuth login will not work.`);
  }
});

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d', // I'm setting tokens to expire after 7 days
  },
  oauth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/callback/google`,
    },
    github: {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/callback/github`,
    },
  },
  client: {
    url: process.env.CLIENT_URL,
  },
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
};
