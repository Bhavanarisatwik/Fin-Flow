import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { Layout } from './layouts/Layout';
import { Welcome } from './pages/Welcome';
import { Onboarding } from './pages/Onboarding';
import { PinLock } from './pages/PinLock';

// Placeholder Pages
import Dashboard from './pages/Dashboard';
import Investments from './pages/Investments';
import Expenses from './pages/Expenses';
import Goals from './pages/Goals';
import Advisor from './pages/Advisor';
import Profile from './pages/Profile';
import LoanDetails from './pages/LoanDetails';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [needsPinSetup, setNeedsPinSetup] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/welcome');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    // Check if PIN exists
    const storedPin = localStorage.getItem('finflow_pin');
    if (!storedPin && user) {
      setNeedsPinSetup(true);
    } else if (storedPin) {
      // Check if already unlocked this session
      const sessionUnlocked = sessionStorage.getItem('finflow_unlocked');
      if (sessionUnlocked === 'true') {
        setIsUnlocked(true);
      }
    } else {
      setIsUnlocked(true);
    }
  }, [user]);

  if (isLoading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
  if (!user) return null;

  // Show PIN setup for new users
  if (needsPinSetup) {
    return (
      <PinLock
        isSetup={true}
        onUnlock={() => {
          setNeedsPinSetup(false);
          setIsUnlocked(true);
          sessionStorage.setItem('finflow_unlocked', 'true');
        }}
        onSetPin={() => {
          setNeedsPinSetup(false);
          setIsUnlocked(true);
          sessionStorage.setItem('finflow_unlocked', 'true');
        }}
      />
    );
  }

  // Show PIN entry for returning users
  if (!isUnlocked) {
    return (
      <PinLock
        onUnlock={() => {
          setIsUnlocked(true);
          sessionStorage.setItem('finflow_unlocked', 'true');
        }}
      />
    );
  }

  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/onboarding" element={<Onboarding />} />

      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
      <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
      <Route path="/advisor" element={<ProtectedRoute><Advisor /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/loans" element={<ProtectedRoute><LoanDetails /></ProtectedRoute>} />
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
