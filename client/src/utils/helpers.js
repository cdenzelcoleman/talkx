/**
 * I format a date to a relative time string (e.g., "2h ago")
 * This is used for tweet timestamps
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const tweetDate = new Date(date);
  const diffInSeconds = Math.floor((now - tweetDate) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }

  // I'm showing the full date if it's more than 30 days old
  return tweetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * I format a date to a "Joined Month Year" string
 * This is used for profile join dates
 */
export const formatJoinDate = (date) => {
  const joinDate = new Date(date);
  return `Joined ${joinDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })}`;
};

/**
 * I validate tweet content length
 * Returns null if valid, error message if invalid
 */
export const validateTweetContent = (content) => {
  if (!content || content.trim() === '') {
    return 'Tweet cannot be empty';
  }

  if (content.length > 280) {
    return `Tweet is too long (${content.length}/280)`;
  }

  return null;
};

/**
 * I get the character count color based on length
 * Green < 260, Yellow 260-280, Red > 280
 */
export const getCharCountColor = (length) => {
  if (length > 280) {
    return 'text-red-500';
  } else if (length >= 260) {
    return 'text-yellow-500';
  } else {
    return 'text-green-500';
  }
};
