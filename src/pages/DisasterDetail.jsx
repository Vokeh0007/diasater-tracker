import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDisaster } from '../context/DisasterContext';
import { useAuth } from '../context/AuthContext';
import { saveFavorite, removeFavorite } from '../firebase/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Heart, 
  Zap, 
  Globe,
  AlertTriangle,
  Info,
  Link as LinkIcon
} from 'lucide-react';

const DisasterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAllEvents, loading } = useDisaster();
  const { user, favorites, setFavorites } = useAuth();
  const [disaster, setDisaster] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const allEvents = getAllEvents();
    const foundDisaster = allEvents.find(event => event.id === id);
    
    if (foundDisaster) {
      setDisaster(foundDisaster);
      setIsFavorite(favorites.some(fav => fav.id === foundDisaster.id));
    }
  }, [id, getAllEvents, favorites]);

  const handleFavoriteToggle = async () => {
    if (!user || !disaster) return;

    setFavoriteLoading(true);
    try {
      let updatedFavorites;
      if (isFavorite) {
        updatedFavorites = await removeFavorite(user.uid, disaster.id);
      } else {
        updatedFavorites = await saveFavorite(user.uid, disaster);
      }
      setFavorites(updatedFavorites);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
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
    if (magnitude >= 7) return 'text-red-600 bg-red-50';
    if (magnitude >= 6) return 'text-orange-600 bg-orange-50';
    if (magnitude >= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  if (loading || !disaster) {
    return <LoadingSpinner message="Loading disaster details..." />;
  }

  if (!disaster) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Disaster not found</h2>
          <p className="text-gray-600 mb-4">The disaster you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/disasters"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Disasters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                  {disaster.title}
                </h1>
                
                {disaster.magnitude && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${getMagnitudeColor(disaster.magnitude)}`}>
                      <Zap className="h-4 w-4" />
                      <span className="font-semibold">
                        Magnitude {disaster.magnitude}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {disaster.categories && disaster.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium"
                    >
                      {category.title}
                    </span>
                  ))}
                </div>
              </div>

              {user && (
                <button
                  onClick={handleFavoriteToggle}
                  disabled={favoriteLoading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isFavorite
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span className="font-medium">
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  Event Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Date & Time</p>
                      <p className="text-gray-600">{formatDate(disaster.date)}</p>
                    </div>
                  </div>

                  {disaster.coordinates && disaster.coordinates.length >= 2 && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        {disaster.place ? (
                          <p className="text-gray-600">{disaster.place}</p>
                        ) : (
                          <p className="text-gray-600">
                            {disaster.coordinates[1].toFixed(4)}°N, {disaster.coordinates[0].toFixed(4)}°E
                          </p>
                        )}
                        {disaster.depth && (
                          <p className="text-sm text-gray-500 mt-1">
                            Depth: {disaster.depth.toFixed(1)} km
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Data Source</p>
                      <p className="text-gray-600">{disaster.source}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {disaster.description}
                </p>

                {/* External Links */}
                {disaster.sources && disaster.sources.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <LinkIcon className="h-4 w-4 mr-2 text-blue-600" />
                      Sources & Links
                    </h3>
                    <div className="space-y-2">
                      {disaster.sources.map((source, index) => (
                        <a
                          key={index}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>{source.id || 'View Details'}</span>
                        </a>
                      ))}
                      {disaster.link && (
                        <a
                          href={disaster.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Official Event Page</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Technical Details for Earthquakes */}
            {disaster.type === 'earthquake' && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Earthquake Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {disaster.magnitude && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 mb-1">Magnitude</p>
                      <p className={`text-2xl font-bold ${getMagnitudeColor(disaster.magnitude).split(' ')[0]}`}>
                        {disaster.magnitude}
                      </p>
                    </div>
                  )}
                  
                  {disaster.depth && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 mb-1">Depth</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {disaster.depth.toFixed(1)} km
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-1">Type</p>
                    <p className="text-2xl font-bold text-gray-900">Earthquake</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Link
            to="/disasters"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Disasters</span>
          </Link>
          
          <Link
            to="/statistics"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>View Statistics</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DisasterDetail;