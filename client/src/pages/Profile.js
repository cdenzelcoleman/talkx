import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../services/userService';
import Layout from '../components/common/Layout';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import TweetCard from '../components/tweets/TweetCard';
import TweetForm from '../components/tweets/TweetForm';
import Button from '../components/common/Button';

// I'm creating the Profile page to display user profiles and their tweets
// This fetches profile data and tweets based on the username parameter

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tweets');
  const [showTweetForm, setShowTweetForm] = useState(false);
  const [editingTweet, setEditingTweet] = useState(null);

  // I'm fetching the profile data when the username changes
  useEffect(() => {
    fetchProfile();
  }, [username]);

  // I'm fetching the user profile
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getUserProfile(username);
      setProfile(result.user);
      setTweets(result.tweets);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(
        err.response?.status === 404
          ? 'User not found'
          : 'Failed to load profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // I'm handling successful tweet creation/edit
  const handleTweetSuccess = (newTweet) => {
    if (editingTweet) {
      // I'm updating the edited tweet
      setTweets((prevTweets) =>
        prevTweets.map((t) => (t._id === newTweet._id ? newTweet : t))
      );
      setEditingTweet(null);
    } else {
      // I'm adding the new tweet to the top
      setTweets((prevTweets) => [newTweet, ...prevTweets]);
      // I'm updating the tweet count
      setProfile((prev) => ({ ...prev, tweetCount: prev.tweetCount + 1 }));
    }
  };

  // I'm handling tweet deletion
  const handleTweetDelete = (tweetId) => {
    setTweets((prevTweets) => prevTweets.filter((t) => t._id !== tweetId));
    // I'm updating the tweet count
    setProfile((prev) => ({ ...prev, tweetCount: prev.tweetCount - 1 }));
  };

  // I'm handling tweet edit
  const handleTweetEdit = (tweet) => {
    setEditingTweet(tweet);
    setShowTweetForm(true);
  };

  // I'm handling like toggle
  const handleLikeToggle = (tweetId, isLiked) => {
    setTweets((prevTweets) =>
      prevTweets.map((t) =>
        t._id === tweetId
          ? {
              ...t,
              isLiked,
              likeCount: isLiked ? t.likeCount + 1 : t.likeCount - 1,
            }
          : t
      )
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar onTweetClick={() => setShowTweetForm(true)} />

        <Layout>
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Loading profile...
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={fetchProfile}>Try Again</Button>
            </div>
          ) : profile ? (
            <>
              {/* I'm adding the profile header */}
              <ProfileHeader profile={profile} />

              {/* I'm adding the profile tabs */}
              <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

              {/* I'm adding the tweets list */}
              <div>
                {tweets.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <p>No tweets yet</p>
                  </div>
                ) : (
                  tweets.map((tweet) => (
                    <TweetCard
                      key={tweet._id}
                      tweet={tweet}
                      onEdit={handleTweetEdit}
                      onDelete={handleTweetDelete}
                      onLikeToggle={handleLikeToggle}
                    />
                  ))
                )}
              </div>
            </>
          ) : null}
        </Layout>

        {/* I'm adding a floating action button for mobile */}
        <button
          onClick={() => setShowTweetForm(true)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors z-40"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* I'm adding the tweet form modal */}
      <TweetForm
        isOpen={showTweetForm}
        onClose={() => {
          setShowTweetForm(false);
          setEditingTweet(null);
        }}
        onSuccess={handleTweetSuccess}
        editingTweet={editingTweet}
      />
    </>
  );
};

export default Profile;
