import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DisasterCard from '../components/DisasterCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Heart, AlertTriangle, LogIn } from 'lucide-react';
import { signInWithGoogle } from '../firebase/auth';

const Favorites = () => {
  const { user, favorites, loading } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFavoriteChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading favorites..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-md p-8">
          <LogIn className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            You need to sign in to view and manage your favorite disasters.
          </p>
          <button
            onClick={handleSignIn}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mx-auto"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In with Google</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          </div>
          <p className="text-gray-600">
            {favorites.length} saved disaster{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-md p-12 max-w-lg mx-auto">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-gray-900 mb-4">No favorites yet</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Start building your collection by adding disasters to your favorites. 
                Click the heart icon on any disaster card to save it here.
              </p>
              <Link
                to="/disasters"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Browse All Disasters
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* User Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
              <div className="flex items-center space-x-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="h-12 w-12 rounded-full"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">
                      {user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.displayName || 'User'}
                  </h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((disaster) => (
                <DisasterCard
                  key={`${disaster.id}-${refreshKey}`}
                  disaster={disaster}
                  isFavorite={true}
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="mt-12 text-center">
              <Link
                to="/disasters"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Discover More Disasters
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;