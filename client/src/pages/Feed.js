import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFollowingFeed, getDiscoverFeed } from '../services/tweetService';
import Layout from '../components/common/Layout';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';
import TweetCard from '../components/tweets/TweetCard';
import TweetForm from '../components/tweets/TweetForm';
import Button from '../components/common/Button';

// I'm creating the Feed page to display tweets
// This includes Following and Discover tabs

const Feed = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('following');
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTweetForm, setShowTweetForm] = useState(false);
  const [editingTweet, setEditingTweet] = useState(null);

  // I'm fetching tweets when the active tab changes
  useEffect(() => {
    fetchTweets();
  }, [activeTab]);

  // I'm fetching tweets based on the active tab
  const fetchTweets = async () => {
    setLoading(true);
    setError(null);

    try {
      let result;
      if (activeTab === 'following') {
        result = await getFollowingFeed();
      } else {
        result = await getDiscoverFeed();
      }
      setTweets(result.tweets);
    } catch (err) {
      console.error('Error fetching tweets:', err);
      setError('Failed to load tweets. Please try again.');
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
    }
  };

  // I'm handling tweet deletion
  const handleTweetDelete = (tweetId) => {
    setTweets((prevTweets) => prevTweets.filter((t) => t._id !== tweetId));
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
          {/* I'm adding the page header */}
          <div className="sticky top-16 z-30 bg-white dark:bg-dark-surface bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white px-4 py-4">
              Home
            </h1>

            {/* I'm adding feed tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('following')}
                className={`flex-1 px-4 py-4 font-semibold text-center transition-colors relative ${
                  activeTab === 'following'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface'
                }`}
              >
                Following
                {activeTab === 'following' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('discover')}
                className={`flex-1 px-4 py-4 font-semibold text-center transition-colors relative ${
                  activeTab === 'discover'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface'
                }`}
              >
                Discover
                {activeTab === 'discover' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* I'm adding the tweet list */}
          <div>
            {loading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Loading tweets...
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <Button onClick={fetchTweets}>Try Again</Button>
              </div>
            ) : tweets.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                {activeTab === 'following' ? (
                  <>
                    <p className="mb-2">No tweets yet!</p>
                    <p className="text-sm">
                      Follow some users to see their tweets here, or check out the
                      Discover feed.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mb-2">No tweets yet!</p>
                    <p className="text-sm">Be the first to post something.</p>
                  </>
                )}
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

export default Feed;
