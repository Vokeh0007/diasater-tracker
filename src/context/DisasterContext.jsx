import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchEONETEvents, fetchUSGSEarthquakes } from '../services/api';

const DisasterContext = createContext();

export const useDisaster = () => {
  const context = useContext(DisasterContext);
  if (!context) {
    throw new Error('useDisaster must be used within a DisasterProvider');
  }
  return context;
};

export const DisasterProvider = ({ children }) => {
  const [disasters, setDisasters] = useState([]);
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const loadCachedData = () => {
    try {
      const cachedDisasters = localStorage.getItem('disasters');
      const cachedEarthquakes = localStorage.getItem('earthquakes');
      const cachedTimestamp = localStorage.getItem('lastFetch');

      if (cachedDisasters && cachedEarthquakes && cachedTimestamp) {
        const timestamp = new Date(cachedTimestamp);
        const now = new Date();
        const hoursDiff = (now - timestamp) / (1000 * 60 * 60);

        // Use cached data if less than 1 hour old
        if (hoursDiff < 1) {
          setDisasters(JSON.parse(cachedDisasters));
          setEarthquakes(JSON.parse(cachedEarthquakes));
          setLastFetch(timestamp);
          return true;
        }
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
    return false;
  };

  const saveToCache = (disastersData, earthquakesData) => {
    try {
      const timestamp = new Date();
      localStorage.setItem('disasters', JSON.stringify(disastersData));
      localStorage.setItem('earthquakes', JSON.stringify(earthquakesData));
      localStorage.setItem('lastFetch', timestamp.toISOString());
      setLastFetch(timestamp);
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  const fetchData = async (forceRefresh = false) => {
    if (!forceRefresh && loadCachedData()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [eonetData, usgsData] = await Promise.all([
        fetchEONETEvents(),
        fetchUSGSEarthquakes()
      ]);

      setDisasters(eonetData);
      setEarthquakes(usgsData);
      saveToCache(eonetData, usgsData);
    } catch (err) {
      setError(err.message);
      // If API fails, try to load cached data as fallback
      loadCachedData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAllEvents = () => {
    return [...disasters, ...earthquakes];
  };

  const value = {
    disasters,
    earthquakes,
    loading,
    error,
    lastFetch,
    fetchData,
    getAllEvents
  };

  return (
    <DisasterContext.Provider value={value}>
      {children}
    </DisasterContext.Provider>
  );
};