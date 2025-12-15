import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentUser } from '../services/authService';

// I'm creating the AuthCallback page to handle OAuth redirects
// This receives the JWT token and redirects appropriately

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // I'm getting the token and newUser flag from URL params
      const token = searchParams.get('token');
      const isNewUser = searchParams.get('newUser') === 'true';

      if (!token) {
        // I'm redirecting to landing if no token provided
        navigate('/', { replace: true });
        return;
      }

      try {
        // I'm storing the token temporarily
        localStorage.setItem('token', token);

        // I'm fetching the user data
        const userData = await getCurrentUser();

        // I'm logging in the user with the Auth context
        login(token, userData.user);

        // I'm redirecting based on whether this is a new user
        if (isNewUser) {
          navigate('/onboarding', { replace: true });
        } else {
          navigate('/feed', { replace: true });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // I'm clearing the invalid token
        localStorage.removeItem('token');
        // I'm redirecting to landing
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  // I'm showing a loading state while processing
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">T</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Signing you in...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
