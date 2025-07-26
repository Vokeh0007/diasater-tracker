import React, { useMemo } from 'react';
import { useDisaster } from '../context/DisasterContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { BarChart3, PieChart, TrendingUp, Globe, Calendar, Zap } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Statistics = () => {
  const { disasters, earthquakes, loading, error, fetchData } = useDisaster();

  const stats = useMemo(() => {
    const allEvents = [...disasters, ...earthquakes];
    
    // Category breakdown
    const categoryCount = {};
    disasters.forEach(disaster => {
      disaster.categories?.forEach(category => {
        categoryCount[category.title] = (categoryCount[category.title] || 0) + 1;
      });
    });

    // Add earthquakes
    if (earthquakes.length > 0) {
      categoryCount['Earthquakes'] = earthquakes.length;
    }

    // Magnitude distribution
    const magnitudeRanges = {
      '4.0-4.9': 0,
      '5.0-5.9': 0,
      '6.0-6.9': 0,
      '7.0+': 0
    };

    earthquakes.forEach(eq => {
      if (eq.magnitude >= 7.0) magnitudeRanges['7.0+']++;
      else if (eq.magnitude >= 6.0) magnitudeRanges['6.0-6.9']++;
      else if (eq.magnitude >= 5.0) magnitudeRanges['5.0-5.9']++;
      else if (eq.magnitude >= 4.0) magnitudeRanges['4.0-4.9']++;
    });

    // Timeline data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyCount = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyCount[dateStr] = 0;
    }

    allEvents.forEach(event => {
      const eventDate = new Date(event.date);
      if (eventDate >= thirtyDaysAgo) {
        const dateStr = eventDate.toISOString().split('T')[0];
        if (dailyCount[dateStr] !== undefined) {
          dailyCount[dateStr]++;
        }
      }
    });

    return {
      total: allEvents.length,
      totalDisasters: disasters.length,
      totalEarthquakes: earthquakes.length,
      categoryCount,
      magnitudeRanges,
      dailyCount,
      highMagnitudeEqs: earthquakes.filter(eq => eq.magnitude >= 6.0).length,
      recentEvents: allEvents.filter(event => 
        new Date(event.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
    };
  }, [disasters, earthquakes]);

  // Chart configurations
  const categoryChartData = {
    labels: Object.keys(stats.categoryCount),
    datasets: [
      {
        label: 'Number of Events',
        data: Object.values(stats.categoryCount),
        backgroundColor: [
          '#EF4444', // Red - Wildfires
          '#3B82F6', // Blue - Storms
          '#F59E0B', // Yellow - Earthquakes
          '#06B6D4', // Cyan - Floods
          '#F97316', // Orange - Volcanoes
          '#10B981', // Green - Other
          '#8B5CF6', // Purple
          '#EC4899', // Pink
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const magnitudeChartData = {
    labels: Object.keys(stats.magnitudeRanges),
    datasets: [
      {
        label: 'Number of Earthquakes',
        data: Object.values(stats.magnitudeRanges),
        backgroundColor: '#F59E0B',
        borderColor: '#D97706',
        borderWidth: 1,
      },
    ],
  };

  const timelineChartData = {
    labels: Object.keys(stats.dailyCount).sort().slice(-7), // Last 7 days
    datasets: [
      {
        label: 'Daily Events',
        data: Object.keys(stats.dailyCount).sort().slice(-7).map(date => stats.dailyCount[date]),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  if (loading && stats.total === 0) {
    return <LoadingSpinner message="Loading statistics..." />;
  }

  if (error && stats.total === 0) {
    return <ErrorMessage message={error} onRetry={() => fetchData(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
            Disaster Statistics
          </h1>
          <p className="text-gray-600 mt-2">Comprehensive analysis of global disaster data</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Earthquakes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEarthquakes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Major Earthquakes (6.0+)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.highMagnitudeEqs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentEvents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Disaster Types Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <PieChart className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Disaster Types</h2>
            </div>
            {Object.keys(stats.categoryCount).length > 0 ? (
              <Pie data={categoryChartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No data available
              </div>
            )}
          </div>

          {/* Earthquake Magnitude Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-5 w-5 text-yellow-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Earthquake Magnitudes</h2>
            </div>
            {stats.totalEarthquakes > 0 ? (
              <Bar data={magnitudeChartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No earthquake data available
              </div>
            )}
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity (Last 7 Days)</h2>
          </div>
          {stats.total > 0 ? (
            <Line data={timelineChartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No recent data available
            </div>
          )}
        </div>

        {/* Detailed Statistics Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Detailed Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(stats.categoryCount).map(([category, count]) => (
                  <tr key={category}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((count / stats.total) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;