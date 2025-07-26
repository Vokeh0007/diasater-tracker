import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDisaster } from '../context/DisasterContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DisasterCard from '../components/DisasterCard';
import { Globe, BarChart3, Heart, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';

const Home = () => {
  const { disasters, earthquakes, loading, error, fetchData, lastFetch } = useDisaster();
  const [recentEvents, setRecentEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    highMagnitudeEarthquakes: 0,
    activeWildfires: 0,
    recentEvents: 0
  });

  useEffect(() => {
    const allEvents = [...disasters, ...earthquakes];
    
    // Get recent events (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recent = allEvents
      .filter(event => new Date(event.date) >= sevenDaysAgo)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
    
    setRecentEvents(recent);

    // Calculate stats
    const highMagEarthquakes = earthquakes.filter(eq => eq.magnitude >= 5.0).length;
    const activeWildfires = disasters.filter(d => 
      d.categories?.some(cat => cat.title === 'Wildfires')
    ).length;

    setStats({
      totalEvents: allEvents.length,
      highMagnitudeEarthquakes: highMagEarthquakes,
      activeWildfires,
      recentEvents: recent.length
    });
  }, [disasters, earthquakes]);

  const handleRefresh = () => {
    fetchData(true);
  };

  if (loading && recentEvents.length === 0) {
    return <LoadingSpinner message="Loading disaster data..." />;
  }

  if (error && recentEvents.length === 0) {
    return <ErrorMessage message={error} onRetry={handleRefresh} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Globe className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Disaster Tracker
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Real-time monitoring of natural disasters and earthquakes worldwide using NASA and USGS data
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/disasters"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                View All Disasters
              </Link>
              <Link
                to="/statistics"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-400 transition-colors"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                View Statistics
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Major Earthquakes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.highMagnitudeEarthquakes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Wildfires</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeWildfires}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentEvents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Disasters</h2>
            <div className="flex items-center space-x-4">
              {lastFetch && (
                <span className="text-sm text-gray-500">
                  Last updated: {lastFetch.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {recentEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recentEvents.map((event) => (
                <DisasterCard key={event.id} disaster={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent disasters found</p>
            </div>
          )}

          <div className="text-center">
            <Link
              to="/disasters"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Disasters
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Data</h3>
              <p className="text-gray-600">
                Live updates from NASA EONET and USGS earthquake monitoring systems
              </p>
            </div>
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">
                Comprehensive statistics and visualizations of disaster patterns
              </p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Tracking</h3>
              <p className="text-gray-600">
                Save and track disasters of interest with your personal favorites list
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;