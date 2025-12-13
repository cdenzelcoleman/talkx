# Twitter/X Clone Design - MVP
**Date:** 2025-12-13
**Project:** TalkX - Social Media Clone with MERN Stack

---

## Overview

A Twitter/X-inspired social media platform with core posting, following, and liking functionality. Built with MERN stack (MongoDB, Express, React, Node.js), featuring OAuth authentication, responsive design, and light/dark mode support.

---

## MVP Scope

### Core Features
- **Text-only tweets** (280 character limit)
- **User profiles** (OAuth-provided avatar, username, user-set bio, join date, tweet count)
- **Follow/Unfollow** functionality
- **Two feeds:** Following (personalized) and Discover (all tweets)
- **Like system** (like/unlike tweets)
- **OAuth authentication** (Google & GitHub) with onboarding flow
- **Tweet management:** Create, Edit, Delete with edit indicators
- **Theme system:** Light and dark mode
- **Responsive design:** Mobile and desktop friendly

### Explicitly Out of Scope (for MVP)
- No search functionality
- No notifications system
- No media uploads (text-only)
- No real-time updates (manual refresh)
- No replies/comments/threads
- No retweets
- No hashtags or mentions
- No DMs

---

## Technical Architecture

### Tech Stack
- **Backend:** Node.js + Express.js + MongoDB/Mongoose
- **Frontend:** React + React Router + Tailwind CSS
- **Authentication:** Passport.js with OAuth (Google & GitHub strategies)
- **State Management:** React Context API (AuthContext, ThemeContext)
- **HTTP Client:** Axios

### Project Structure

#### Backend (`server/`)
```
server/
├── config/
│   ├── database.js      # MongoDB connection
│   ├── passport.js      # OAuth strategies configuration
│   └── environment.js   # Environment variables
├── middleware/
│   ├── auth.js          # JWT verification middleware
│   ├── errorHandler.js  # Global error handling
│   └── validation.js    # Request validation
├── features/
│   ├── auth/
│   │   ├── auth.routes.js
│   │   ├── auth.controller.js
│   │   └── auth.service.js
│   ├── users/
│   │   ├── users.routes.js
│   │   ├── users.controller.js
│   │   └── users.service.js
│   ├── tweets/
│   │   ├── tweets.routes.js
│   │   ├── tweets.controller.js
│   │   └── tweets.service.js
│   ├── follows/
│   │   ├── follows.routes.js
│   │   ├── follows.controller.js
│   │   └── follows.service.js
│   └── likes/
│       ├── likes.routes.js
│       ├── likes.controller.js
│       └── likes.service.js
├── models/
│   ├── User.js
│   ├── Tweet.js
│   ├── Follow.js
│   └── Like.js
├── utils/
│   ├── jwt.js           # JWT token generation/verification
│   └── validators.js    # Input validation helpers
└── server.js            # Express app entry point
```

#### Frontend (`client/`)
```
client/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Layout.jsx
│   │   ├── tweets/
│   │   │   ├── TweetCard.jsx
│   │   │   ├── TweetForm.jsx
│   │   │   ├── TweetList.jsx
│   │   │   └── TweetActions.jsx
│   │   ├── profile/
│   │   │   ├── ProfileHeader.jsx
│   │   │   ├── ProfileInfo.jsx
│   │   │   └── FollowButton.jsx
│   │   └── navigation/
│   │       ├── Navbar.jsx
│   │       └── TabBar.jsx
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Landing.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   └── Callback.jsx
│   │   ├── Feed/
│   │   │   └── FeedPage.jsx
│   │   └── Profile/
│   │       └── ProfilePage.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── services/
│   │   ├── api.js           # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── tweetService.js
│   │   ├── userService.js
│   │   ├── followService.js
│   │   └── likeService.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useTheme.js
│   ├── utils/
│   │   └── helpers.js
│   └── App.jsx              # Router, theme provider
```

---

## Database Schema Design

### User Model (`users` collection)
```javascript
{
  _id: ObjectId,
  oauthProvider: String,        // 'google' or 'github'
  oauthId: String,              // Unique ID from OAuth provider (indexed)
  username: String,             // From OAuth, unique, indexed
  email: String,                // From OAuth
  profilePicture: String,       // OAuth avatar URL
  bio: String,                  // Set during onboarding (max 160 chars)
  createdAt: Date,              // Join date
  tweetCount: Number            // Denormalized for quick display
}

// Indexes:
// - { oauthId: 1, oauthProvider: 1 } (unique, compound)
// - { username: 1 } (unique)
```

### Tweet Model (`tweets` collection)
```javascript
{
  _id: ObjectId,
  author: ObjectId,             // Reference to User._id (indexed)
  content: String,              // Max 280 characters, required
  likeCount: Number,            // Denormalized count, default 0
  createdAt: Date,              // Tweet timestamp (indexed, desc)
  updatedAt: Date,              // Last edit timestamp
  isEdited: Boolean,            // Show "edited" indicator, default false
  editHistory: [{               // Optional edit tracking
    content: String,
    editedAt: Date
  }]
}

// Indexes:
// - { author: 1, createdAt: -1 } (for user tweet history)
// - { createdAt: -1 } (for discover feed)
```

### Follow Model (`follows` collection)
```javascript
{
  _id: ObjectId,
  follower: ObjectId,           // User doing the following (indexed)
  following: ObjectId,          // User being followed (indexed)
  createdAt: Date
}

// Indexes:
// - { follower: 1, following: 1 } (unique, compound - prevent duplicate follows)
// - { follower: 1 } (for getting following list)
// - { following: 1 } (for getting followers list)
```

### Like Model (`likes` collection)
```javascript
{
  _id: ObjectId,
  user: ObjectId,               // User who liked (indexed)
  tweet: ObjectId,              // Tweet being liked (indexed)
  createdAt: Date
}

// Indexes:
// - { user: 1, tweet: 1 } (unique, compound - prevent duplicate likes)
// - { tweet: 1 } (for counting likes on a tweet)
// - { user: 1 } (for checking if user liked a tweet)
```

**Design Notes:**
- Using denormalized counts (`tweetCount`, `likeCount`) for performance
- When a tweet is created, increment user's `tweetCount`
- When liked, increment tweet's `likeCount`
- Avoids expensive count queries on every page load
- Trade-off: Slightly more complex write operations for faster reads

---

## API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | `/auth/google` | Initiate Google OAuth | No |
| GET | `/auth/github` | Initiate GitHub OAuth | No |
| GET | `/auth/callback/google` | Google OAuth callback | No |
| GET | `/auth/callback/github` | GitHub OAuth callback | No |
| POST | `/auth/onboarding` | Save bio after first login | Yes |
| GET | `/auth/me` | Get current authenticated user | Yes |
| POST | `/auth/logout` | Clear session/token | Yes |

### User Routes (`/api/users`)
| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | `/users/:id` | Get user profile by ID | No |
| GET | `/users/:id/tweets` | Get user's tweets (future use) | No |

### Tweet Routes (`/api/tweets`)
| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/tweets` | Create new tweet | Yes |
| GET | `/tweets/feed/following` | Get Following feed | Yes |
| GET | `/tweets/feed/discover` | Get Discover feed (all tweets) | No |
| PATCH | `/tweets/:id` | Edit tweet (owner only) | Yes |
| DELETE | `/tweets/:id` | Delete tweet (owner only) | Yes |

### Follow Routes (`/api/follows`)
| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/follows/:userId` | Follow a user | Yes |
| DELETE | `/follows/:userId` | Unfollow a user | Yes |
| GET | `/follows/check/:userId` | Check if current user follows userId | Yes |

### Like Routes (`/api/likes`)
| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/likes/:tweetId` | Like a tweet | Yes |
| DELETE | `/likes/:tweetId` | Unlike a tweet | Yes |
| GET | `/likes/check/:tweetId` | Check if current user liked tweet | Yes |

---

## Authentication Flow

### OAuth Implementation with Passport.js

**First-Time User Flow:**
1. User clicks "Sign in with Google/GitHub" on landing page
2. Redirected to OAuth provider for authorization
3. Provider redirects back to `/api/auth/callback/{provider}`
4. Backend:
   - Finds or creates User document
   - Generates JWT with payload: `{ userId, username, profilePicture, exp }`
   - Returns JWT to frontend
5. Frontend stores JWT in localStorage
6. **If new user:** Redirect to `/onboarding` to set bio
7. **If existing user:** Redirect to `/feed` (Following tab)

**Returning User Flow:**
1. User clicks "Sign in with Google/GitHub"
2. OAuth flow completes (may auto-approve if already authorized)
3. Backend generates new JWT
4. Frontend stores JWT, redirects to `/feed`

**JWT Strategy:**
- JWT stored in `localStorage` (accessible to React)
- Included in requests via `Authorization: Bearer <token>` header
- Payload: `{ userId, username, profilePicture, exp }`
- Token expiry: 7 days
- Refresh strategy: Generate new token on activity (future enhancement)

**Protected Routes Middleware:**
```javascript
// I verify the JWT token on every protected route
// If invalid/expired, return 401 and frontend redirects to login
// If valid, I attach the full user object to req.user for use in controllers
```

**Onboarding Flow:**
```javascript
// POST /api/auth/onboarding
// Body: { bio: "My bio here" }
// I validate bio length (max 160 chars)
// Update user document with bio
// Return success, frontend redirects to /feed
```

**Session Management:**
- Frontend checks for JWT on app load
- If expired/invalid, redirect to landing page
- `GET /auth/me` endpoint to verify token validity and fetch fresh user data
- Logout clears localStorage and optionally blacklists token (future enhancement)

---

## Frontend Architecture

### React Router Setup

**Public Routes (no auth required):**
- `/` → Landing page with OAuth login buttons
- `/auth/callback` → Handle OAuth redirect, store JWT

**Protected Routes (require authentication):**
- `/feed` → Main feed with tabs (Following/Discover)
- `/profile/:userId` → User profile page
- `/onboarding` → Bio setup for new users (one-time)

**Route Protection:**
```javascript
// PrivateRoute component wraps protected routes
// Checks for valid JWT before rendering
// If no JWT or invalid, redirects to /
```

### Component Hierarchy

**FeedPage (`/feed`):**
```
FeedPage
├── Navbar
│   ├── Logo
│   ├── ThemeToggle (sun/moon icon)
│   └── ProfileLink (avatar + dropdown)
├── TweetForm (compose new tweet)
│   ├── Avatar preview
│   ├── Textarea (with char counter)
│   └── Post button
├── FeedTabs
│   ├── Following tab
│   └── Discover tab
└── TweetList
    └── TweetCard (per tweet)
        ├── UserInfo
        │   ├── Avatar (clickable → profile)
        │   ├── Username (clickable → profile)
        │   └── Timestamp (relative, e.g., "2h ago")
        ├── TweetContent
        │   ├── Text content
        │   └── "edited" badge (if isEdited)
        └── TweetActions
            ├── LikeButton (heart icon + count)
            └── EditDeleteButtons (if owner)
```

**ProfilePage (`/profile/:userId`):**
```
ProfilePage
├── Navbar
├── ProfileHeader
│   ├── Avatar (large, from OAuth)
│   ├── Username
│   ├── Bio
│   ├── Join date ("Joined January 2025")
│   ├── Tweet count ("42 tweets")
│   └── FollowButton (if not current user)
│       ├── "Follow" (if not following)
│       └── "Following" (if following, click to unfollow)
└── (Future: User's tweet list)
```

**OnboardingPage (`/onboarding`):**
```
OnboardingPage
├── Welcome message
├── Avatar preview (from OAuth)
├── Username display (from OAuth)
└── BioForm
    ├── Textarea (max 160 chars, counter)
    └── Continue button
```

### Context Providers

**AuthContext:**
```javascript
// I provide: { user, login, logout, isAuthenticated, loading }
// - user: Current user object { id, username, profilePicture, bio }
// - login: Function to store JWT and fetch user data
// - logout: Function to clear JWT and user state
// - isAuthenticated: Boolean computed from JWT presence
// - loading: Boolean for async auth operations

// On app mount:
// - Check localStorage for JWT
// - If found, validate with GET /auth/me
// - Set user state if valid, clear if invalid
```

**ThemeContext:**
```javascript
// I provide: { theme, toggleTheme }
// - theme: 'light' | 'dark'
// - toggleTheme: Function to switch themes

// On mount:
// - Check localStorage for saved theme preference
// - Default to 'light' if not found
// - Apply 'dark' class to document.documentElement if dark mode

// On toggle:
// - Update state
// - Update localStorage
// - Add/remove 'dark' class on document.documentElement for Tailwind
```

---

## UI/UX & Theme System

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',  // Enables dark: prefix, controlled by 'dark' class on html element
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2',      // Twitter blue for accents (buttons, links)
        dark: {
          bg: '#15202B',          // Dark background
          surface: '#192734',     // Dark cards/surfaces
          border: '#38444D',      // Dark borders
          text: '#FFFFFF',        // Dark mode text
          textMuted: '#8899A6',   // Dark mode secondary text
        },
        light: {
          bg: '#FFFFFF',          // Light background
          surface: '#F7F9F9',     // Light cards/surfaces (slight gray)
          border: '#E1E8ED',      // Light borders
          text: '#14171A',        // Light mode text
          textMuted: '#657786',   // Light mode secondary text
        }
      }
    }
  },
  plugins: [],
}
```

### Component Design Patterns

**TweetCard:**
- Surface: `bg-light-surface dark:bg-dark-surface`
- Border: `border border-light-border dark:border-dark-border`
- Padding: `p-4`
- Avatar: `w-12 h-12 rounded-full`
- Username: `font-semibold text-light-text dark:text-dark-text`
- Timestamp: `text-sm text-light-textMuted dark:text-dark-textMuted`
- Content: `mt-2 text-light-text dark:text-dark-text leading-relaxed`
- "edited" badge: `text-xs text-light-textMuted dark:text-dark-textMuted ml-2`
- Hover state: `hover:bg-light-bg dark:hover:bg-dark-bg transition-colors`
- Like button: Gray outline when not liked, red fill when liked

**TweetForm:**
- Sticky positioning at top of feed (optional)
- Surface: Same as TweetCard
- Textarea: Auto-resize, focus:ring-2 ring-primary
- Character counter:
  - Green when < 260
  - Yellow when 260-280
  - Red when > 280 (disable Post button)
- Post button: `bg-primary text-white rounded-full px-6 py-2 disabled:opacity-50`
- Disabled when empty or > 280 chars

**Navbar:**
- Fixed at top: `fixed top-0 w-full z-50`
- Surface: `bg-light-surface dark:bg-dark-surface border-b`
- Logo: "TalkX" in primary color
- Theme toggle: Sun icon (light mode) / Moon icon (dark mode)
- Profile dropdown: Avatar + username, click for dropdown (logout, view profile)

**FollowButton:**
- Not following: `bg-primary text-white "Follow"`
- Following: `bg-transparent border-2 border-primary text-primary "Following"`
- Hover on following: `bg-red-500 border-red-500 text-white "Unfollow"`

### Responsive Strategy

**Mobile (< 768px):**
- Single column layout
- Full-width components (no max-width)
- Bottom tab bar navigation (Home, Profile icons)
- Smaller avatars (40x40px in tweets)
- Reduced padding

**Desktop (≥ 768px):**
- Max-width container: `max-w-2xl mx-auto` (centered)
- Top navbar with horizontal links
- Larger avatars (48x48px in tweets)
- Comfortable padding (p-6)
- Fixed sidebar space for future features (trends, suggestions)

**Transitions:**
- Theme toggle: `transition-colors duration-200` on major elements
- Button hovers: `transition-all duration-150`
- Smooth color changes when switching light/dark mode

---

## Key User Flows

### Flow 1: New User Signup
1. User lands on `/` → Landing page displays "TalkX" branding + "Sign in with Google/GitHub" buttons
2. User clicks "Sign in with Google" → redirected to Google OAuth consent screen
3. User authorizes → Google redirects to `/api/auth/callback/google`
4. Backend:
   - Receives OAuth profile data (id, email, username, avatar)
   - Creates new User document in MongoDB
   - Generates JWT with userId, username, profilePicture
5. Callback redirects to frontend `/auth/callback` with JWT in URL or cookie
6. Frontend stores JWT in localStorage, calls `login()` from AuthContext
7. AuthContext detects new user (no bio yet) → redirects to `/onboarding`
8. User enters bio (max 160 chars), clicks "Continue"
9. `POST /api/auth/onboarding` updates user.bio
10. Redirected to `/feed` (Following tab) → sees empty state with prompt to discover users

### Flow 2: Posting a Tweet
1. User on `/feed`, sees TweetForm at top
2. Types in textarea: "Hello world! This is my first tweet."
3. Character counter updates: "25 / 280" (green)
4. Clicks "Post" button
5. Frontend:
   - `POST /api/tweets` with `{ content: "Hello world!..." }`
   - Includes `Authorization: Bearer <JWT>` header
6. Backend:
   - Validates content (not empty, ≤ 280 chars)
   - Creates Tweet document with author = req.user._id
   - Increments user.tweetCount
   - Returns created tweet with populated author data
7. Frontend:
   - Receives new tweet
   - Prepends to TweetList (appears at top)
   - Clears TweetForm textarea and resets counter
8. User sees their tweet immediately in feed

### Flow 3: Following a User
1. User on `/feed` in Discover tab, sees tweet from "jane_doe"
2. Clicks on "jane_doe" username → navigates to `/profile/jane_doe_id`
3. ProfilePage loads:
   - Fetches `GET /users/jane_doe_id` for profile data
   - Fetches `GET /follows/check/jane_doe_id` to see if already following
4. FollowButton shows "Follow" (not following yet)
5. User clicks "Follow"
6. Frontend:
   - `POST /api/follows/jane_doe_id`
7. Backend:
   - Creates Follow document: `{ follower: currentUser._id, following: jane_doe_id }`
8. Frontend:
   - FollowButton changes to "Following"
9. When user returns to `/feed` and clicks Following tab:
   - `GET /tweets/feed/following` returns tweets from followed users
   - Now includes jane_doe's tweets

### Flow 4: Liking a Tweet
1. User sees tweet in feed, heart icon is outlined (not liked)
2. Clicks heart icon
3. Frontend:
   - Optimistic update: Fill heart with red, increment likeCount by 1
   - `POST /api/likes/tweet_id`
4. Backend:
   - Creates Like document: `{ user: currentUser._id, tweet: tweet_id }`
   - Increments tweet.likeCount
5. Frontend receives success response, update confirmed
6. User clicks heart again (unlike):
   - Optimistic update: Outline heart, decrement likeCount by 1
   - `DELETE /api/likes/tweet_id`
7. Backend:
   - Removes Like document
   - Decrements tweet.likeCount

### Flow 5: Editing a Tweet
1. User sees their own tweet, sees "Edit" button (only visible to tweet owner)
2. Clicks "Edit"
3. TweetCard transforms:
   - Content becomes textarea with current text
   - Edit/Delete buttons become "Save" and "Cancel"
4. User modifies text: "Hello world! This is my edited tweet."
5. Clicks "Save"
6. Frontend:
   - `PATCH /api/tweets/tweet_id` with `{ content: "Hello world! This is my edited tweet." }`
7. Backend:
   - Validates content
   - Updates tweet.content, tweet.updatedAt, tweet.isEdited = true
   - Pushes old content to tweet.editHistory array (optional)
8. Frontend:
   - TweetCard exits edit mode
   - Content updates in place
   - "edited" badge appears next to timestamp
9. User sees updated tweet with edit indicator

### Flow 6: Deleting a Tweet
1. User sees their own tweet, clicks "Delete" button
2. Confirmation modal appears: "Are you sure? This can't be undone."
3. User confirms
4. Frontend:
   - `DELETE /api/tweets/tweet_id`
5. Backend:
   - Verifies ownership (tweet.author === req.user._id)
   - Deletes Tweet document
   - Decrements user.tweetCount
   - (Optional: Also delete associated Like documents)
6. Frontend:
   - Removes tweet from TweetList
   - Shows success toast: "Tweet deleted"

### Flow 7: Theme Toggle
1. User on any page, clicks sun/moon icon in Navbar
2. Frontend:
   - ThemeContext.toggleTheme() is called
   - Updates state: `theme: 'dark'` (if was light)
   - Updates localStorage: `localStorage.setItem('theme', 'dark')`
   - Adds `dark` class to `document.documentElement`
3. Tailwind applies all `dark:` classes instantly
4. All components transition smoothly (via `transition-colors duration-200`)
5. User sees dark mode applied across entire app

---

## Error Handling Strategy

### Backend Error Handling

**Global Error Middleware:**
```javascript
// I catch all errors thrown in route handlers
// Format consistent error responses:
// {
//   success: false,
//   message: "User-friendly error message",
//   error: "Technical error details" (only in dev mode)
// }
```

**Common Error Scenarios:**
- **401 Unauthorized:** Invalid/expired JWT → "Please log in again"
- **403 Forbidden:** Trying to edit/delete others' tweets → "You can't do that"
- **404 Not Found:** User/tweet doesn't exist → "Not found"
- **400 Bad Request:** Validation errors (e.g., tweet too long) → "Tweet must be 280 characters or less"
- **409 Conflict:** Trying to follow already-followed user → "Already following"
- **500 Server Error:** Unexpected errors → "Something went wrong, please try again"

### Frontend Error Handling

**API Service Layer:**
```javascript
// I wrap all axios calls in try-catch
// Check response status codes
// Show user-friendly error messages via toast notifications or inline errors
```

**Error Display Patterns:**
- **Toast Notifications:** For async operations (like, follow, post)
  - Success: Green toast "Tweet posted!"
  - Error: Red toast "Failed to post tweet. Try again."
- **Inline Errors:** For forms (TweetForm, Onboarding)
  - Show error text below field in red
  - Example: "Tweet is too long (305 / 280)"
- **Empty States:** For empty feeds/profiles
  - Following feed empty: "You're not following anyone yet. Check out the Discover feed!"
  - Discover feed empty (unlikely): "No tweets yet. Be the first to post!"
- **404 Page:** For invalid routes/profiles
  - "Page not found" with link back to feed

### Network Error Handling
- Detect offline status via `navigator.onLine`
- Show banner: "You're offline. Some features may not work."
- Disable Post button when offline
- Retry failed requests when back online (optional enhancement)

---

## Testing Strategy (Future Enhancement)

While testing is not part of the initial MVP implementation, here's the recommended approach for future iterations:

### Backend Testing
- **Unit Tests:** Test services/controllers in isolation (Jest)
- **Integration Tests:** Test API endpoints with test database (Supertest)
- **Key Test Cases:**
  - Auth: OAuth flow, JWT generation/verification
  - Tweets: Create, edit, delete with ownership checks
  - Follows: Prevent duplicate follows, correct feed generation
  - Likes: Prevent duplicate likes, correct count updates

### Frontend Testing
- **Unit Tests:** Test utility functions, context providers (Jest + React Testing Library)
- **Component Tests:** Test isolated components (TweetCard, TweetForm)
- **Integration Tests:** Test user flows (posting, liking, following)
- **Key Test Cases:**
  - Auth flow: Login, onboarding, token expiry
  - Tweet operations: Post, edit, delete with UI updates
  - Theme toggle: Dark mode applies correctly
  - Responsive design: Mobile/desktop layouts

---

## Deployment Considerations (Future)

### Backend Deployment
- **Platform:** Heroku, Railway, Render, or AWS EC2
- **Environment Variables:**
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
  - `CLIENT_URL` (for OAuth redirects)
- **Database:** MongoDB Atlas (cloud-hosted)

### Frontend Deployment
- **Platform:** Vercel, Netlify, or AWS S3 + CloudFront
- **Environment Variables:**
  - `REACT_APP_API_URL` (backend URL)
- **Build:** `npm run build` → static files in `build/`

### Production Considerations
- HTTPS required for OAuth
- CORS configuration for frontend domain
- Rate limiting on API endpoints
- Database indexes for performance
- JWT secret rotation strategy
- OAuth callback URLs configured in Google/GitHub consoles

---

## Future Enhancements (Post-MVP)

### High Priority
1. **Replies/Comments:** Threaded conversations
2. **Notifications:** In-app and email for likes, follows, replies
3. **User Search:** Find users by username/display name
4. **Tweet Search:** Full-text search on tweet content
5. **Profile Editing:** Allow bio/username updates

### Medium Priority
6. **Image Uploads:** Support 1-4 images per tweet (Cloudinary/S3)
7. **Real-time Updates:** WebSocket or SSE for live feed updates
8. **Retweets:** Share others' tweets to your followers
9. **Hashtags:** Tag tweets, trending hashtags page
10. **Mentions:** @username tagging with notifications

### Low Priority
11. **Bookmarks:** Save tweets for later
12. **Lists:** Curated lists of users
13. **Direct Messages:** Private conversations
14. **Tweet Analytics:** View count, engagement metrics
15. **Verified Badges:** Mark verified accounts

---

## Code Documentation Standards

Throughout the codebase, include **detailed first-person comments** explaining:
- **Why:** Rationale behind design decisions
- **How:** Complex logic explanations
- **What:** Description of non-obvious code sections
- **Gotchas:** Edge cases, potential issues, workarounds

**Example:**
```javascript
// I'm using a compound index on (follower, following) here because:
// 1. Prevents duplicate follows (unique constraint)
// 2. Speeds up the common query "does user A follow user B?"
// 3. Allows efficient lookup of all users that A follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });
```

---

## Summary

This design provides a **solid foundation for a Twitter/X MVP clone** with:
- ✅ Core social features (post, like, follow)
- ✅ Modern, responsive UI with light/dark mode
- ✅ Scalable architecture with clear separation of concerns
- ✅ OAuth authentication for security and ease of use
- ✅ Efficient database schema with denormalized counts
- ✅ Clear user flows and error handling

**Next Steps:**
1. Set up git repository and project structure
2. Create detailed implementation plan
3. Begin development in isolated git worktree
4. Implement feature by feature with testing

---

**Design Validated:** 2025-12-13
**Ready for Implementation:** Yes
