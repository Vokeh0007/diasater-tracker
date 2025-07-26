import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveFavorite, removeFavorite } from '../firebase/auth';
import { Calendar, MapPin, ExternalLink, Heart, Zap } from 'lucide-react';

const DisasterCard = ({ disaster, isFavorite, onFavoriteChange }) => {
  const { user, setFavorites } = useAuth();

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    try {
      let updatedFavorites;
      if (isFavorite) {
        updatedFavorites = await removeFavorite(user.uid, disaster.id);
      } else {
        updatedFavorites = await saveFavorite(user.uid, disaster);
      }
      setFavorites(updatedFavorites);
      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (categories) => {
    if (!categories || categories.length === 0) return 'bg-gray-100 text-gray-800';
    
    const category = categories[0];
    const colorMap = {
      'Wildfires': 'bg-red-100 text-red-800',
      'Severe Storms': 'bg-blue-100 text-blue-800',
      'Earthquakes': 'bg-yellow-100 text-yellow-800',
      'Floods': 'bg-cyan-100 text-cyan-800',
      'Volcanoes': 'bg-orange-100 text-orange-800',
      'Drought': 'bg-amber-100 text-amber-800',
      'Dust and Haze': 'bg-gray-100 text-gray-800',
      'Snow': 'bg-indigo-100 text-indigo-800'
    };
    
    return colorMap[category.title] || 'bg-gray-100 text-gray-800';
  };

  const getMagnitudeColor = (magnitude) => {
    if (magnitude >= 7) return 'text-red-600';
    if (magnitude >= 6) return 'text-orange-600';
    if (magnitude >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Link to={`/disaster/${disaster.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 group-hover:border-blue-300">
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {disaster.title}
              </h3>
              {disaster.magnitude && (
                <div className="flex items-center space-x-1 mt-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className={`font-semibold ${getMagnitudeColor(disaster.magnitude)}`}>
                    Magnitude {disaster.magnitude}
                  </span>
                </div>
              )}
            </div>
            {user && (
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite
                    ? 'text-red-500 hover:text-red-600 bg-red-50'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {disaster.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(disaster.date)}</span>
            </div>
            
            {disaster.coordinates && disaster.coordinates.length >= 2 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {disaster.place || `${disaster.coordinates[1].toFixed(2)}°, ${disaster.coordinates[0].toFixed(2)}°`}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {disaster.categories && disaster.categories.map((category, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(disaster.categories)}`}
                >
                  {category.title}
                </span>
              ))}
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <ExternalLink className="h-3 w-3" />
              <span>{disaster.source}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DisasterCard;