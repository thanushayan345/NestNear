import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../services/AuthContext";
import { bookingApi, formatLKR } from "../services/api";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    bookingApi
      .listStudent()
      .then((data) => setBookings(data.bookings || []))
      .catch((err) => setError(err.message || "Could not load your bookings."))
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const acceptedBookings = bookings.filter((b) => b.status === "Accepted");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome, {user?.full_name}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Student Dashboard • Track your accommodation booking requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/accommodations"
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900"
          >
            Find Accommodation
          </Link>
          <Link
            to="/student/bookings"
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            All My Bookings
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase">
            Total Requests
          </span>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {bookings.length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-amber-700 uppercase">
            Pending Decisions
          </span>
          <p className="mt-2 text-2xl font-bold text-amber-700">
            {pendingCount}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-emerald-800 uppercase">
            Accepted Bookings
          </span>
          <p className="mt-2 text-2xl font-bold text-emerald-800">
            {acceptedBookings.length}
          </p>
        </div>
      </div>

      {/* Confirmed / Accepted Bookings with Unlocked Owner Contact */}
      {acceptedBookings.length > 0 && (
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-emerald-950">
            Confirmed Accommodation Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acceptedBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white p-4 rounded-lg border border-emerald-200 space-y-2 text-sm"
              >
                <div className="flex items-center justify-between">
                  <Link
                    to={`/accommodations/${booking.accommodation_id}`}
                    className="font-bold text-gray-900 hover:text-emerald-800"
                  >
                    {booking.accommodation.title}
                  </Link>
                  <StatusBadge status={booking.status} />
                </div>
                <p className="text-xs text-gray-600">
                  Move-in date: <strong>{booking.move_in_date}</strong> •{" "}
                  {formatLKR(booking.accommodation.monthly_rent)} / month
                </p>
                <div className="pt-2 border-t border-gray-100 text-xs text-gray-800 space-y-1">
                  <p>
                    <strong>Owner:</strong>{" "}
                    {booking.accommodation.owner_name || "Property Owner"}
                  </p>
                  <p>
                    <strong>Exact Address:</strong>{" "}
                    {booking.accommodation.address}
                  </p>
                  <p>
                    <strong>Owner Phone:</strong>{" "}
                    <a
                      href={`tel:${booking.accommodation.contact_phone}`}
                      className="font-semibold text-emerald-800 underline"
                    >
                      {booking.accommodation.contact_phone}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Booking Requests */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">
            Recent Booking Requests
          </h2>
          <Link
            to="/student/bookings"
            className="text-xs font-semibold text-emerald-800 hover:underline"
          >
            Manage all requests &rarr;
          </Link>
        </div>

        {loading && (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading your booking requests...
          </div>
        )}

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-50">{error}</div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-600">
              You have not sent any booking requests yet.
            </p>
            <Link
              to="/accommodations"
              className="mt-3 inline-block px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900"
            >
              Browse Accommodations
            </Link>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="divide-y divide-gray-200">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <Link
                    to={`/accommodations/${booking.accommodation_id}`}
                    className="text-sm font-semibold text-gray-900 hover:text-emerald-800"
                  >
                    {booking.accommodation.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-gray-600">
                    {booking.accommodation.town},{" "}
                    {booking.accommodation.district} •{" "}
                    {formatLKR(booking.accommodation.monthly_rent)} / month
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Preferred move-in: <strong>{booking.move_in_date}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={booking.status} />
                  <Link
                    to="/student/bookings"
                    className="text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
