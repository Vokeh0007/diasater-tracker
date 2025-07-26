# Disaster Tracker

A comprehensive React Single Page Application for tracking and monitoring real-time natural disasters and earthquakes worldwide using NASA EONET and USGS APIs.

## 🌟 Features

### Core Functionality
- **Real-time Data**: Live updates from NASA EONET API (natural disasters) and USGS Earthquake API
- **Firebase Authentication**: Google Sign-In with user profile management
- **Personal Favorites**: Save and manage favorite disasters with Firebase Firestore
- **Advanced Filtering**: Filter by disaster type, magnitude, date range, and search terms
- **Detailed Views**: Comprehensive disaster information with coordinates, sources, and external links
- **Statistics Dashboard**: Interactive charts showing disaster patterns and trends
- **Offline Support**: LocalStorage caching for data persistence when offline
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices

### Pages & Navigation
- **Home**: Overview with recent disasters and key statistics
- **All Disasters**: Complete list with advanced filtering and pagination
- **Disaster Detail**: In-depth information about individual disasters
- **Favorites**: Personal collection of saved disasters (requires authentication)
- **Statistics**: Interactive charts and data visualization

### Technical Features
- **React Router**: Client-side routing with protected routes
- **Chart.js Integration**: Beautiful data visualizations
- **Axios HTTP Client**: Reliable API communication
- **Real-time Updates**: Automatic data refresh with loading states
- **Error Handling**: Comprehensive error states with retry functionality
- **Responsive UI**: Modern design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager
- Firebase project (for authentication and data storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd disaster-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication and Firestore Database
   - Enable Google Sign-In provider in Authentication settings
   - Copy your Firebase configuration
   - Update `src/firebase/config.js` with your Firebase credentials:

   ```javascript
   export const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 📡 API Data Sources

### NASA EONET API
- **Base URL**: `https://eonet.gsfc.nasa.gov/api/v3`
- **Purpose**: Natural disaster events (wildfires, storms, floods, etc.)
- **Documentation**: [NASA EONET API Docs](https://eonet.gsfc.nasa.gov/docs/v3)
- **Data Types**: Wildfires, Severe Storms, Floods, Volcanoes, Drought, Snow, Dust and Haze

### USGS Earthquake API
- **Base URL**: `https://earthquake.usgs.gov/fdsnws/event/1`
- **Purpose**: Real-time earthquake data
- **Documentation**: [USGS API Documentation](https://earthquake.usgs.gov/fdsnws/event/1/)
- **Data Types**: Earthquake events with magnitude, location, and depth information

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar with authentication
│   ├── DisasterCard.jsx # Individual disaster display card
│   ├── FilterBar.jsx   # Search and filter controls
│   ├── Pagination.jsx  # Page navigation component
│   ├── LoadingSpinner.jsx # Loading state indicator
│   └── ErrorMessage.jsx   # Error state display
├── pages/              # Page components
│   ├── Home.jsx        # Landing page with overview
│   ├── AllDisasters.jsx # Complete disaster listing
│   ├── DisasterDetail.jsx # Individual disaster details
│   ├── Favorites.jsx   # User's saved disasters
│   └── Statistics.jsx  # Data visualization dashboard
├── context/            # React Context providers
│   ├── AuthContext.jsx # Authentication state management
│   └── DisasterContext.jsx # Disaster data management
├── services/           # API integration
│   └── api.js         # NASA EONET and USGS API calls
├── firebase/           # Firebase configuration
│   ├── config.js      # Firebase project configuration
│   └── auth.js        # Authentication and Firestore operations
└── App.tsx            # Main application component
```

## 🔧 Configuration

### Environment Setup
The application uses Firebase for authentication and data storage. Ensure you have:

1. **Firebase Project**: Created and configured with Authentication and Firestore
2. **Google OAuth**: Enabled in Firebase Authentication providers
3. **Firestore Rules**: Configured for user data access

### Firebase Security Rules
Add these rules to your Firestore for proper data security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📱 Usage Guide

### Getting Started
1. **Browse Disasters**: Visit the home page to see recent disasters and key statistics
2. **View All Events**: Navigate to "All Disasters" for the complete list with filtering options
3. **Sign In**: Use Google Sign-In to access favorites and personalization features
4. **Save Favorites**: Click the heart icon on any disaster to save it to your favorites
5. **View Statistics**: Explore the Statistics page for data visualizations and trends

### Filtering & Search
- **Text Search**: Search by disaster title, description, or location
- **Category Filter**: Filter by disaster type (wildfires, earthquakes, storms, etc.)
- **Magnitude Filter**: Filter earthquakes by magnitude range
- **Date Range**: Show disasters from specific time periods
- **Reset Filters**: Clear all filters to show all disasters

### Offline Support
- Data is automatically cached in localStorage
- Cached data is used when the network is unavailable
- Cache expires after 1 hour to ensure data freshness

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Dependencies
- **React 18**: Modern React with hooks and concurrent features
- **React Router Dom**: Client-side routing
- **Firebase**: Authentication and database
- **Axios**: HTTP client for API requests
- **Chart.js & React-Chartjs-2**: Data visualization
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library

### API Rate Limits
- **NASA EONET**: No explicit rate limits, but use responsibly
- **USGS**: Rate limits apply, cached data helps reduce requests

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your repository to your deployment platform
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

### Environment Variables
No environment variables are required as Firebase configuration is handled in the code.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support & Troubleshooting

### Common Issues

**Firebase Authentication Not Working**
- Verify Firebase configuration in `src/firebase/config.js`
- Ensure Google OAuth is enabled in Firebase Console
- Check browser console for detailed error messages

**API Data Not Loading**
- Check network connectivity
- Verify API endpoints are accessible
- Check browser console for CORS or network errors

**Charts Not Displaying**
- Ensure Chart.js dependencies are properly installed
- Check for JavaScript errors in browser console

### Getting Help
- Check the [Issues](../../issues) page for known problems
- Create a new issue for bugs or feature requests
- Review API documentation for data-related questions

## 🔗 Links

- [NASA EONET API](https://eonet.gsfc.nasa.gov/docs/v3)
- [USGS Earthquake API](https://earthquake.usgs.gov/fdsnws/event/1/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)