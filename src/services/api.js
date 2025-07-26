import axios from 'axios';

const EONET_BASE_URL = 'https://eonet.gsfc.nasa.gov/api/v3';
const USGS_BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1';

// Create axios instance with timeout
const apiClient = axios.create({
  timeout: 10000,
});

export const fetchEONETEvents = async (limit = 100) => {
  try {
    const response = await apiClient.get(`${EONET_BASE_URL}/events`, {
      params: {
        limit,
        status: 'open',
        format: 'json'
      }
    });

    return response.data.events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description || 'No description available',
      link: event.link,
      categories: event.categories,
      sources: event.sources,
      geometry: event.geometry,
      type: 'disaster',
      date: event.geometry?.[0]?.date || new Date().toISOString(),
      coordinates: event.geometry?.[0]?.coordinates || [0, 0],
      magnitude: null,
      source: 'NASA EONET'
    }));
  } catch (error) {
    console.error('Error fetching EONET events:', error);
    throw new Error('Failed to fetch disaster events');
  }
};

export const fetchUSGSEarthquakes = async () => {
  try {
    const endTime = new Date();
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - 30); // Last 30 days

    const response = await apiClient.get(`${USGS_BASE_URL}/query`, {
      params: {
        format: 'geojson',
        starttime: startTime.toISOString().split('T')[0],
        endtime: endTime.toISOString().split('T')[0],
        minmagnitude: 4.0,
        limit: 100,
        orderby: 'time'
      }
    });

    return response.data.features.map(earthquake => ({
      id: earthquake.id,
      title: earthquake.properties.title,
      description: `Magnitude ${earthquake.properties.mag} earthquake`,
      link: earthquake.properties.url,
      categories: [{ id: 12, title: 'Earthquakes' }],
      sources: [{ id: 'usgs', url: earthquake.properties.url }],
      geometry: [{
        coordinates: earthquake.geometry.coordinates,
        date: new Date(earthquake.properties.time).toISOString()
      }],
      type: 'earthquake',
      date: new Date(earthquake.properties.time).toISOString(),
      coordinates: earthquake.geometry.coordinates,
      magnitude: earthquake.properties.mag,
      depth: earthquake.geometry.coordinates[2],
      place: earthquake.properties.place,
      source: 'USGS'
    }));
  } catch (error) {
    console.error('Error fetching USGS earthquakes:', error);
    throw new Error('Failed to fetch earthquake data');
  }
};

export const getEventById = (events, id) => {
  return events.find(event => event.id === id);
};