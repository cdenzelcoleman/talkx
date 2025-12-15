# TalkX - Twitter/X Clone

A full-stack Twitter/X clone built with the MERN stack (MongoDB, Express, React, Node.js). Features include OAuth authentication, tweet posting, following users, liking tweets, and dark mode.

## Features

- **Authentication**: OAuth login with Google and GitHub
- **Tweet Management**: Post, edit, and delete tweets (280 character limit)
- **Social Features**: Follow/unfollow users, like/unlike tweets
- **Feeds**: Following feed (tweets from users you follow) and Discover feed (all tweets)
- **User Profiles**: View user profiles with bio, tweet count, and tweet history
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

### Backend
- **Node.js** & **Express**: RESTful API server
- **MongoDB** & **Mongoose**: Database and ODM
- **Passport.js**: OAuth authentication (Google & GitHub)
- **JWT**: Token-based session management
- **bcrypt**: Password hashing (if needed for future features)

### Frontend
- **React**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client with interceptors
- **Tailwind CSS**: Utility-first styling
- **Context API**: State management for auth and theme

## Project Structure

```
talkx/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       │   ├── common/     # Button, Layout, Modal, etc.
│       │   ├── navigation/ # Navbar, Sidebar
│       │   ├── profile/    # Profile components
│       │   └── tweets/     # Tweet components
│       ├── contexts/       # React contexts (Auth, Theme)
│       ├── pages/          # Route pages
│       ├── services/       # API service layers
│       └── utils/          # Helper functions
│
├── server/                 # Express backend
│   ├── config/            # Database and environment config
│   ├── features/          # Feature-based route organization
│   │   ├── auth/          # Authentication routes
│   │   ├── tweets/        # Tweet CRUD routes
│   │   ├── follows/       # Follow/unfollow routes
│   │   ├── likes/         # Like/unlike routes
│   │   └── users/         # User profile routes
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose schemas
│   ├── utils/             # Utility functions (JWT, etc.)
│   └── server.js          # Express app entry point
│
└── docs/                  # Documentation
    ├── plans/             # Implementation plans
    └── OAUTH_SETUP.md     # OAuth configuration guide
```

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (running locally or remote connection)
- **npm** or **yarn**
- **Google OAuth credentials** (optional, for login)
- **GitHub OAuth credentials** (optional, for login)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cdenzelcoleman/talkx.git
   cd talkx
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create `server/.env`:
   ```bash
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/talkx

   # JWT
   JWT_SECRET=your-super-secret-jwt-key

   # OAuth - Google (see docs/OAUTH_SETUP.md)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # OAuth - GitHub (see docs/OAUTH_SETUP.md)
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret

   # URLs
   CLIENT_URL=http://localhost:3000
   SERVER_URL=http://localhost:5000

   # Environment
   NODE_ENV=development
   PORT=5000
   ```

   Create `client/.env`:
   ```bash
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Configure OAuth** (Optional)

   See [docs/OAUTH_SETUP.md](docs/OAUTH_SETUP.md) for detailed instructions on setting up Google and GitHub OAuth.

   **Note**: The app will run without OAuth credentials, but login functionality will not work.

### Running the Application

1. **Start MongoDB**
   ```bash
   # If using Homebrew on macOS
   brew services start mongodb-community

   # Or start manually
   mongod --config /usr/local/etc/mongod.conf
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

   Server will run on http://localhost:5000

3. **Start the frontend client** (in a new terminal)
   ```bash
   cd client
   npm start
   ```

   Client will run on http://localhost:3000

4. **Open your browser**

   Navigate to http://localhost:3000

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/callback/github` - GitHub OAuth callback
- `POST /api/auth/onboarding` - Complete user onboarding
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Tweets
- `POST /api/tweets` - Create a tweet
- `GET /api/tweets/feed/following` - Get following feed
- `GET /api/tweets/feed/discover` - Get discover feed
- `PATCH /api/tweets/:id` - Edit a tweet
- `DELETE /api/tweets/:id` - Delete a tweet

### Follows
- `POST /api/follows/:userId` - Follow a user
- `DELETE /api/follows/:userId` - Unfollow a user
- `GET /api/follows/check/:userId` - Check follow status

### Likes
- `POST /api/likes/:tweetId` - Like a tweet
- `DELETE /api/likes/:tweetId` - Unlike a tweet
- `GET /api/likes/check/:tweetId` - Check like status

### Users
- `GET /api/users/:id` - Get user profile

## Development

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Building for Production
```bash
# Build frontend
cd client
npm run build

# The build folder can be served by the backend or deployed separately
```

### Code Style

The project uses ESLint for code quality. Some warnings are expected during development (unused variables, etc.) and can be ignored or fixed as needed.

## Known Issues / Limitations

1. **OAuth Required for Login**: Currently, there's no email/password authentication. Only OAuth (Google/GitHub) login is supported.
2. **No Image Upload**: Profile pictures are fetched from OAuth providers only.
3. **No Comments/Replies**: Tweet replies are not yet implemented (MVP focuses on core features).
4. **No Notifications**: Real-time notifications are not implemented.
5. **Limited Search**: No search functionality for users or tweets yet.

## Future Enhancements

- [ ] Add tweet replies/threads
- [ ] Implement user search
- [ ] Add notifications system
- [ ] Support image/video uploads
- [ ] Add retweet functionality
- [ ] Implement hashtags
- [ ] Add direct messaging
- [ ] Improve profile customization
- [ ] Add analytics/stats

## Contributing

This is a personal project, but suggestions and bug reports are welcome! Feel free to open an issue.

## License

MIT License - feel free to use this project for learning or personal use.

## Acknowledgments

- Inspired by Twitter/X
- Built following the implementation plan in `docs/plans/2025-12-13-talkx-implementation.md`
- Created with assistance from Claude Code

---

**Built by Cameron Coleman** | [GitHub](https://github.com/cdenzelcoleman)
