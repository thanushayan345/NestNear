import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AccommodationDetailsPage from "./pages/AccommodationDetailsPage";
import AccommodationSearchPage from "./pages/AccommodationSearchPage";
import AddAccommodationPage from "./pages/AddAccommodationPage";
import EditAccommodationPage from "./pages/EditAccommodationPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import OwnerBookingsPage from "./pages/OwnerBookingsPage";
import OwnerDashboardPage from "./pages/OwnerDashboardPage";
import RegisterPage from "./pages/RegisterPage";
import StudentBookingsPage from "./pages/StudentBookingsPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import { AuthProvider } from "./services/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/accommodations"
                element={<AccommodationSearchPage />}
              />
              <Route
                path="/accommodations/:id"
                element={<AccommodationDetailsPage />}
              />

              {/* Student Pages */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute role="student">
                    <StudentDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/bookings"
                element={
                  <ProtectedRoute role="student">
                    <StudentBookingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Owner Pages */}
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute role="owner">
                    <OwnerDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/accommodations/new"
                element={
                  <ProtectedRoute role="owner">
                    <AddAccommodationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/accommodations/:id/edit"
                element={
                  <ProtectedRoute role="owner">
                    <EditAccommodationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/bookings"
                element={
                  <ProtectedRoute role="owner">
                    <OwnerBookingsPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Not Found Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
