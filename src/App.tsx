import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DisasterProvider } from './context/DisasterContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AllDisasters from './pages/AllDisasters';
import DisasterDetail from './pages/DisasterDetail';
import Favorites from './pages/Favorites';
import Statistics from './pages/Statistics';

function App() {
  return (
    <AuthProvider>
      <DisasterProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/disasters" element={<AllDisasters />} />
              <Route path="/disaster/:id" element={<DisasterDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/statistics" element={<Statistics />} />
            </Routes>
          </div>
        </Router>
      </DisasterProvider>
    </AuthProvider>
  );
}

export default App;