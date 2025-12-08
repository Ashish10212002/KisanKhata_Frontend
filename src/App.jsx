import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import Context
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import FarmDetails from './pages/FarmDetails';
import TransactionHistory from './pages/TransactionHistory';
import Assistant from './pages/Assistant';
import Welcome from './pages/Welcome';

// Protected Route Wrapper
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/farms" element={<PrivateRoute><Layout><Farms /></Layout></PrivateRoute>} />
          <Route path="/farms/:id" element={<PrivateRoute><Layout><FarmDetails /></Layout></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><Layout><TransactionHistory /></Layout></PrivateRoute>} />
          <Route path="/ai" element={<PrivateRoute><Layout><Assistant /></Layout></PrivateRoute>} />
          <Route path="/welcome" element={<PrivateRoute><Layout><Welcome /></Layout></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;