import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { Layout } from './layouts/Layout';
import { Onboarding } from './pages/Onboarding';

// Placeholder Pages
import Dashboard from './pages/Dashboard';
import Investments from './pages/Investments';
import Goals from './pages/Goals';
import Advisor from './pages/Advisor';
import Profile from './pages/Profile';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/onboarding');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
  if (!user) return null;

  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />

      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
      <Route path="/advisor" element={<ProtectedRoute><Advisor /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App;
