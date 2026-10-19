import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../services/AuthContext";
import {
  accommodationApi,
  formatLKR,
  resolveImageUrl,
} from "../services/api";

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function loadMyListings() {
    setLoading(true);
    setError("");
    try {
      const data = await accommodationApi.listMine();
      setAccommodations(data.accommodations || []);
    } catch (err) {
      setError(err.message || "Could not load your listings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMyListings();
  }, []);

  async function handleToggleAvailability(item) {
    setBusyId(item.id);
    setError("");
    try {
      await accommodationApi.updateAvailability(item.id, !item.is_available);
      await loadMyListings();
    } catch (err) {
      setError(err.message || "Could not update availability.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This will also remove its booking requests.`
    );
    if (!confirmed) return;

    setBusyId(item.id);
    setError("");
    try {
      await accommodationApi.remove(item.id);
      setAccommodations((prev) => prev.filter((a) => a.id !== item.id));
    } catch (err) {
      setError(err.message || "Could not delete listing.");
    } finally {
      setBusyId(null);
    }
  }

  const totalPending = accommodations.reduce(
    (sum, item) => sum + (item.pending_requests || 0),
    0
  );
  const availableListings = accommodations.filter(
    (a) => a.is_available && a.available_rooms > 0
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Owner Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome, {user?.full_name} • Manage your properties and booking
            requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/owner/bookings"
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
          >
            Booking Requests ({totalPending} Pending)
          </Link>
          <Link
            to="/owner/accommodations/new"
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900"
          >
            + Add Accommodation
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase">
            My Properties
          </span>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {accommodations.length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-emerald-800 uppercase">
            Currently Available
          </span>
          <p className="mt-2 text-2xl font-bold text-emerald-800">
            {availableListings}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-amber-700 uppercase">
            Pending Booking Requests
          </span>
          <p className="mt-2 text-2xl font-bold text-amber-700">
            {totalPending}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Owner Listings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">
            My Accommodation Listings
          </h2>
          <Link
            to="/owner/accommodations/new"
            className="text-xs font-semibold text-emerald-800 hover:underline"
          >
            + Add new listing
          </Link>
        </div>

        {loading && (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading your listings...
          </div>
        )}

        {!loading && accommodations.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-sm text-gray-600">
              You have not published any accommodation listings yet.
            </p>
            <Link
              to="/owner/accommodations/new"
              className="mt-4 inline-block px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900"
            >
              Publish Your First Listing
            </Link>
          </div>
        )}

        {!loading && accommodations.length > 0 && (
          <div className="divide-y divide-gray-200">
            {accommodations.map((item) => {
              const imgSrc = resolveImageUrl(item.image_url);
              const isAvailable = item.is_available && item.available_rooms > 0;
              return (
                <div
                  key={item.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt={item.title}
                        className="w-full sm:w-36 h-24 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/accommodations/${item.id}`}
                          className="text-base font-bold text-gray-900 hover:text-emerald-800"
                        >
                          {item.title}
                        </Link>
                        <StatusBadge
                          status={isAvailable ? "Available" : "Not Available"}
                        />
                        {item.pending_requests > 0 && (
                          <Link
                            to="/owner/bookings"
                            className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"
                          >
                            {item.pending_requests} Pending Request
                            {item.pending_requests > 1 ? "s" : ""}
                          </Link>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-600">
                        {item.accommodation_type} • {item.town}, {item.district}{" "}
                        • Near {item.nearby_university}
                      </p>
                      <p className="mt-1 text-xs text-gray-700">
                        <strong>{formatLKR(item.monthly_rent)}</strong> / month
                        • Available rooms:{" "}
                        <strong>{item.available_rooms}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => handleToggleAvailability(item)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                    >
                      {item.is_available
                        ? "Mark Unavailable"
                        : "Mark Available"}
                    </button>
                    <Link
                      to={`/owner/accommodations/${item.id}/edit`}
                      className="px-3 py-1.5 rounded-lg border border-emerald-700 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => handleDelete(item)}
                      className="px-3 py-1.5 rounded-lg border border-red-300 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
