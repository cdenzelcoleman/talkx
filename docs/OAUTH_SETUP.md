# OAuth Setup Guide for TalkX

This guide explains how to set up Google and GitHub OAuth authentication for TalkX.

## Prerequisites

- A Google Cloud Console account
- A GitHub account

## Current Status

The app is currently running with placeholder OAuth credentials. OAuth login **will not work** until you configure real credentials. However, all other features are functional for development and testing.

## Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" or select an existing project
3. Give your project a name (e.g., "TalkX")

### Step 2: Enable OAuth Consent Screen

1. Navigate to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required fields:
   - App name: `TalkX`
   - User support email: Your email
   - Developer contact email: Your email
4. Click "Save and Continue"
5. Skip the scopes section for now
6. Add test users if needed (during development)
7. Click "Save and Continue"

### Step 3: Create OAuth Credentials

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Configure:
   - Name: `TalkX Web Client`
   - Authorized JavaScript origins: `http://localhost:5000`
   - Authorized redirect URIs: `http://localhost:5000/api/auth/callback/google`
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

### Step 4: Update Your .env File

Add the credentials to `server/.env`:
```bash
GOOGLE_CLIENT_ID=your-actual-client-id
GOOGLE_CLIENT_SECRET=your-actual-client-secret
```

## GitHub OAuth Setup

### Step 1: Register a New OAuth App

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" > "New OAuth App"
3. Fill in the application details:
   - Application name: `TalkX`
   - Homepage URL: `http://localhost:3000`
   - Application description: `Twitter/X clone built with MERN stack`
   - Authorization callback URL: `http://localhost:5000/api/auth/callback/github`
4. Click "Register application"

### Step 2: Get Client Credentials

1. After registration, you'll see your **Client ID**
2. Click "Generate a new client secret" to get your **Client Secret**
3. Copy both values

### Step 3: Update Your .env File

Add the credentials to `server/.env`:
```bash
GITHUB_CLIENT_ID=your-actual-client-id
GITHUB_CLIENT_SECRET=your-actual-client-secret
```

## Verifying OAuth Setup

### Step 1: Restart the Backend Server

After updating the `.env` file:
```bash
cd server
npm run dev
```

You should see no OAuth warnings in the console.

### Step 2: Test OAuth Flow

1. Open http://localhost:3000 in your browser
2. Click "Sign in with Google" or "Sign in with GitHub"
3. Complete the OAuth flow
4. You should be redirected back to the app and logged in

## Production Deployment

When deploying to production, remember to:

1. **Update OAuth redirect URLs** in both Google and GitHub to use your production domain
2. **Update environment variables** in your hosting platform
3. **Enable proper HTTPS** - OAuth requires secure connections in production
4. **Set NODE_ENV=production** in your environment

### Example Production URLs

For Google OAuth:
- Authorized JavaScript origins: `https://yourdomain.com`
- Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`

For GitHub OAuth:
- Homepage URL: `https://yourdomain.com`
- Authorization callback URL: `https://yourdomain.com/api/auth/callback/github`

## Troubleshooting

### OAuth redirect mismatch error

- Verify that your redirect URIs in Google/GitHub match exactly what's in your `.env` file
- Check that `SERVER_URL` in `.env` is set correctly (`http://localhost:5000` for development)

### "Client ID not configured" warning

- Make sure you've updated the `.env` file with real credentials (not the placeholders)
- Restart the backend server after updating `.env`

### User not being created after OAuth

- Check the server logs for any database errors
- Verify MongoDB is running (`mongod` or `brew services list mongodb-community`)
- Check that your user has email permissions granted in the OAuth scope

## Need Help?

If you encounter issues:
1. Check the browser console for frontend errors
2. Check the server logs for backend errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running

## Security Notes

- **Never commit your `.env` file** to version control
- Keep your OAuth client secrets secure
- Rotate credentials if they're ever exposed
- Use separate OAuth apps for development and production
