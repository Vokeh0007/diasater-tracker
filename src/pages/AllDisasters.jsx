import React, { useState, useEffect, useMemo } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DisasterCard from '../components/DisasterCard';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const AllDisasters = () => {
  const { getAllEvents, loading, error, fetchData, lastFetch } = useDisaster();
  const { favorites } = useAuth();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMagnitude, setSelectedMagnitude] = useState('');
  const [dateRange, setDateRange] = useState('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  // Refresh tracking
  const [refreshing, setRefreshing] = useState(false);

  const allEvents = getAllEvents();

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    let filtered = [...allEvents];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.place && event.place.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event =>
        event.categories?.some(cat => cat.title === selectedCategory)
      );
    }

    // Magnitude filter
    if (selectedMagnitude && selectedMagnitude !== 'all') {
      filtered = filtered.filter(event => {
        if (!event.magnitude) return false;
        const mag = event.magnitude;
        
        switch (selectedMagnitude) {
          case '4-4.9': return mag >= 4.0 && mag < 5.0;
          case '5-5.9': return mag >= 5.0 && mag < 6.0;
          case '6-6.9': return mag >= 6.0 && mag < 7.0;
          case '7+': return mag >= 7.0;
          default: return true;
        }
      });
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const days = parseInt(dateRange);
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(event => new Date(event.date) >= cutoffDate);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    return filtered;
  }, [allEvents, searchTerm, selectedCategory, selectedMagnitude, dateRange]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedMagnitude, dateRange]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedMagnitude('');
    setDateRange('all');
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  };

  const isFavorite = (eventId) => {
    return favorites.some(fav => fav.id === eventId);
  };

  if (loading && allEvents.length === 0) {
    return <LoadingSpinner message="Loading all disasters..." />;
  }

  if (error && allEvents.length === 0) {
    return <ErrorMessage message={error} onRetry={handleRefresh} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Disasters</h1>
            <p className="text-gray-600 mt-2">
              Showing {filteredEvents.length} of {allEvents.length} disasters
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {lastFetch && (
              <span className="text-sm text-gray-500">
                Last updated: {lastFetch.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedMagnitude={selectedMagnitude}
          setSelectedMagnitude={setSelectedMagnitude}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onReset={handleReset}
        />

        {/* Results */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No disasters found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentEvents.map((event) => (
                <DisasterCard
                  key={event.id}
                  disaster={event}
                  isFavorite={isFavorite(event.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredEvents.length}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AllDisasters;