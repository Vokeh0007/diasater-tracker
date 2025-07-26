import React from 'react';
import { Search, Filter, Calendar, RotateCcw } from 'lucide-react';

const FilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory,
  selectedMagnitude,
  setSelectedMagnitude,
  dateRange,
  setDateRange,
  onReset 
}) => {
  const categories = [
    'All',
    'Wildfires',
    'Severe Storms', 
    'Earthquakes',
    'Floods',
    'Volcanoes',
    'Drought',
    'Dust and Haze',
    'Snow'
  ];

  const magnitudeRanges = [
    { label: 'All', value: 'all' },
    { label: '4.0 - 4.9', value: '4-4.9' },
    { label: '5.0 - 5.9', value: '5-5.9' },
    { label: '6.0 - 6.9', value: '6-6.9' },
    { label: '7.0+', value: '7+' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filter & Search</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search disasters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {/* Magnitude Filter */}
        <select
          value={selectedMagnitude}
          onChange={(e) => setSelectedMagnitude(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Magnitude (All)</option>
          {magnitudeRanges.map(range => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>

        {/* Date Range */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="1">Last 24 Hours</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;