import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-600">
        Loading your account...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user.role !== role) {
    const fallback =
      user.role === "owner" ? "/owner/dashboard" : "/student/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
