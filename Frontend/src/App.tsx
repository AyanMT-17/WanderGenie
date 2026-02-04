import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import Home from '@/pages/Home';
import CreateTrip from '@/pages/CreateTrip';
import ItineraryResult from '@/pages/ItineraryResult';
import TripDetails from '@/pages/TripDetails';
import Chat from '@/pages/Chat';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

import LandingPage from '@/pages/LandingPage';

// Layout wrapper for protected routes
function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans anti-aliased">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/planner" element={<CreateTrip />} />
          <Route path="/itinerary" element={<ItineraryResult />} />
          <Route path="/trip/:id" element={<TripDetails />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route path="/*" element={<ProtectedLayout />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
