import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { bookingApi, resolveImageUrl } from "../services/api";

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function loadBookings(filter = statusFilter) {
    setLoading(true);
    setError("");
    try {
      const data = await bookingApi.listOwner(filter);
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || "Could not load booking requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function handleDecision(bookingId, newStatus) {
    setBusyId(bookingId);
    setError("");
    try {
      await bookingApi.updateStatus(bookingId, newStatus);
      await loadBookings(statusFilter);
    } catch (err) {
      setError(err.message || "Could not update booking status.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            to="/owner/dashboard"
            className="text-sm font-medium text-emerald-800 hover:underline"
          >
            &larr; Back to Owner Dashboard
          </Link>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900">
            Student Booking Requests
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Review incoming booking requests and accept or reject them.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "All", value: "" },
            { label: "Pending", value: "Pending" },
            { label: "Accepted", value: "Accepted" },
            { label: "Rejected", value: "Rejected" },
            { label: "Cancelled", value: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                statusFilter === tab.value
                  ? "bg-emerald-800 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="py-16 text-center text-gray-500 text-sm">
          Loading booking requests...
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <h3 className="text-base font-semibold text-gray-900">
            No booking requests found
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            When students submit booking requests for your properties, they will
            appear here.
          </p>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => {
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
                      {booking.accommodation.town} • Remaining rooms:{" "}
                      <strong>{booking.accommodation.available_rooms}</strong>
                    </p>
                    <p className="text-xs text-gray-800">
                      <strong>Student:</strong> {booking.student.full_name} •{" "}
                      <strong>Preferred Move-In:</strong>{" "}
                      {booking.move_in_date}
                    </p>
                    {booking.message && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                        &ldquo;{booking.message}&rdquo;
                      </p>
                    )}

                    {/* Student contact info unlocked after owner accepts */}
                    {booking.status === "Accepted" &&
                      booking.student.phone && (
                        <div className="mt-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                          <p>
                            <strong>Student Phone:</strong>{" "}
                            <a
                              href={`tel:${booking.student.phone}`}
                              className="font-semibold underline"
                            >
                              {booking.student.phone}
                            </a>
                          </p>
                          <p>
                            <strong>Student Email:</strong>{" "}
                            <a
                              href={`mailto:${booking.student.email}`}
                              className="font-semibold underline"
                            >
                              {booking.student.email}
                            </a>
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                {/* Owner Action Buttons */}
                <div className="flex sm:flex-row md:flex-col items-end justify-between gap-2">
                  <span className="text-xs text-gray-400">
                    Received {booking.created_at?.slice(0, 10)}
                  </span>

                  {booking.status === "Pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={busyId === booking.id}
                        onClick={() => handleDecision(booking.id, "Accepted")}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900 disabled:opacity-50 cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        disabled={busyId === booking.id}
                        onClick={() => handleDecision(booking.id, "Rejected")}
                        className="px-3.5 py-1.5 rounded-lg border border-red-300 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
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
