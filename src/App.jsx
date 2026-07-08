import React, { Suspense, lazy, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import "./App.css"; // <-- Add this

import LoadingScreen from "./components/LoadingScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import BottomNavigation from "./components/BottomNavigation";
import ChatbotWidget from "./components/ChatbotWidget";
import { AuthContext } from "./context/AuthContext";

// Pages
const SplashPage = lazy(() => import("./pages/SplashPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const AgeSelectionPage = lazy(() => import("./pages/AgeSelectionPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));

const HomePage = lazy(() => import("./pages/HomePage"));
const MedicationsPage = lazy(() => import("./pages/MedicationsPage"));
const ReminderPage = lazy(() => import("./pages/ReminderPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const FamilySupportPage = lazy(() => import("./pages/FamilySupportPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AppSettingsPage = lazy(() => import("./pages/AppSettingsPage"));

function AppShell() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Pages that should NOT show Navbar or Bottom Navigation
  const publicPages = [
    "/",
    "/onboarding",
    "/age-selection",
    "/login",
    "/signup",
    "/forgot-password",
  ];

  const showLayout = !publicPages.includes(location.pathname);

  return (
    <div className="app">

      {/* Navbar */}
      {showLayout && user?.isAuthenticated && <Navbar />}

      <Suspense fallback={<LoadingScreen />}>
        <Routes>

          {/* Public Pages */}
          <Route path="/" element={<SplashPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/age-selection" element={<AgeSelectionPage />} />

          <Route
            path="/login"
            element={
              user?.isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <LoginPage />
              )
            }
          />

          <Route
            path="/signup"
            element={
              user?.isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <SignupPage />
              )
            }
          />

          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          />

          {/* Protected Pages */}

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/medications"
            element={
              <ProtectedRoute>
                <MedicationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reminder/:id"
            element={
              <ProtectedRoute>
                <ReminderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/family"
            element={
              <ProtectedRoute>
                <FamilySupportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/app-settings"
            element={
              <ProtectedRoute>
                <AppSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes */}
          <Route
            path="*"
            element={
              <Navigate
                to={user?.isAuthenticated ? "/home" : "/"}
                replace
              />
            }
          />
        </Routes>
      </Suspense>

      {/* Chatbot */}
      {user?.isAuthenticated && <ChatbotWidget />}

      {/* Bottom Navigation */}
      {showLayout && user?.isAuthenticated && <BottomNavigation />}

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}