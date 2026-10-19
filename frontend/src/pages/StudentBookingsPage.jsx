import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { bookingApi, formatLKR, resolveImageUrl } from "../services/api";

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  async function loadBookings() {
    setLoading(true);
    setError("");
    try {
      const data = await bookingApi.listStudent();
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || "Could not load booking history.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function handleCancel(bookingId) {
    setActionId(bookingId);
    setError("");
    try {
      await bookingApi.cancel(bookingId);
      await loadBookings();
    } catch (err) {
      setError(err.message || "Could not cancel request.");
    } finally {
      setActionId(null);
    }
  }

  const filtered =
    statusFilter === "All"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Booking Requests
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Check the status of your requests or cancel pending requests.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {["All", "Pending", "Accepted", "Rejected", "Cancelled"].map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  statusFilter === tab
                    ? "bg-emerald-800 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="py-16 text-center text-gray-500 text-sm">
          Loading your bookings...
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <h3 className="text-base font-semibold text-gray-900">
            No booking requests found
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Browse accommodations near your university and submit a booking
            request.
          </p>
          <Link
            to="/accommodations"
            className="mt-4 inline-block px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900"
          >
            Find Accommodation
          </Link>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((booking) => {
            const imgSrc = resolveImageUrl(booking.accommodation.image_url);
            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col md:flex-row gap-5 justify-between"
              >
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt={booking.accommodation.title}
                      className="w-full sm:w-36 h-28 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/accommodations/${booking.accommodation_id}`}
                        className="text-base font-bold text-gray-900 hover:text-emerald-800"
                      >
                        {booking.accommodation.title}
                      </Link>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="text-xs text-gray-600">
                      {booking.accommodation.town},{" "}
                      {booking.accommodation.district} • Near{" "}
                      {booking.accommodation.nearby_university}
                    </p>
                    <p className="text-xs text-gray-700">
                      <strong>Monthly Rent:</strong>{" "}
                      {formatLKR(booking.accommodation.monthly_rent)} •{" "}
                      <strong>Preferred Move-In:</strong>{" "}
                      {booking.move_in_date}
                    </p>
                    {booking.message && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                        &ldquo;{booking.message}&rdquo;
                      </p>
                    )}

                    {/* Unlocked private address & phone once Accepted */}
                    {booking.status === "Accepted" &&
                      booking.accommodation.address && (
                        <div className="mt-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                          <p>
                            <strong>Owner:</strong>{" "}
                            {booking.accommodation.owner_name}
                          </p>
                          <p>
                            <strong>Exact Address:</strong>{" "}
                            {booking.accommodation.address}
                          </p>
                          <p>
                            <strong>Contact Phone:</strong>{" "}
                            <a
                              href={`tel:${booking.accommodation.contact_phone}`}
                              className="font-semibold underline"
                            >
                              {booking.accommodation.contact_phone}
                            </a>
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                <div className="flex sm:flex-row md:flex-col items-end justify-between gap-2">
                  <span className="text-xs text-gray-400">
                    Requested {booking.created_at?.slice(0, 10)}
                  </span>
                  {booking.status === "Pending" && (
                    <button
                      type="button"
                      disabled={actionId === booking.id}
                      onClick={() => handleCancel(booking.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-300 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                    >
                      {actionId === booking.id
                        ? "Cancelling..."
                        : "Cancel Request"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
