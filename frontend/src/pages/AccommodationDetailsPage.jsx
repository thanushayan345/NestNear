import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../services/AuthContext";
import {
  accommodationApi,
  bookingApi,
  formatLKR,
  resolveImageUrl,
} from "../services/api";

export default function AccommodationDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking request form state
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const [moveInDate, setMoveInDate] = useState(tomorrow);
  const [message, setMessage] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  async function loadDetails() {
    setLoading(true);
    setError("");
    try {
      const data = await accommodationApi.getById(id);
      setAccommodation(data.accommodation);
    } catch (err) {
      setError(err.message || "Accommodation not found.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id]);

  async function handleBookingSubmit(event) {
    event.preventDefault();
    setBookingError("");
    setBookingSuccess("");
    setBookingSubmitting(true);

    try {
      await bookingApi.create({
        accommodation_id: Number(id),
        move_in_date: moveInDate,
        message,
      });
      setBookingSuccess(
        "Your booking request has been submitted with Pending status!"
      );
      setMessage("");
      await loadDetails();
    } catch (err) {
      setBookingError(err.message || "Could not submit booking request.");
    } finally {
      setBookingSubmitting(false);
    }
  }

  async function handleCancelBooking(bookingId) {
    setBookingError("");
    try {
      await bookingApi.cancel(bookingId);
      setBookingSuccess("Your pending booking request was cancelled.");
      await loadDetails();
    } catch (err) {
      setBookingError(err.message || "Could not cancel booking request.");
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-500 text-sm">
        Loading accommodation details...
      </div>
    );
  }

  if (error || !accommodation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900">
            {error || "Accommodation not found"}
          </h2>
          <Link
            to="/accommodations"
            className="mt-4 inline-block px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const imageSrc = resolveImageUrl(accommodation.image_url);
  const isAvailable =
    accommodation.is_available && accommodation.available_rooms > 0;
  const myBooking = accommodation.my_booking;
  const hasActiveBooking =
    myBooking && ["Pending", "Accepted"].includes(myBooking.status);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-4">
        <Link
          to="/accommodations"
          className="text-sm font-medium text-emerald-800 hover:underline"
        >
          &larr; Back to Accommodation Search
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Photo & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="h-72 sm:h-96 bg-gray-100">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={accommodation.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Photo Available
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-900 text-white">
                  {accommodation.accommodation_type}
                </span>
                <StatusBadge
                  status={isAvailable ? "Available" : "Not Available"}
                />
              </div>

              <h1 className="mt-3 text-2xl font-bold text-gray-900">
                {accommodation.title}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {accommodation.town}, {accommodation.district} District • Near{" "}
                <strong className="text-gray-800">
                  {accommodation.nearby_university}
                </strong>
              </p>

              {/* Key Attributes Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <span className="block text-xs text-gray-500">
                    Monthly Rent
                  </span>
                  <span className="text-base font-bold text-emerald-800">
                    {formatLKR(accommodation.monthly_rent)}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Deposit</span>
                  <span className="text-base font-semibold text-gray-900">
                    {formatLKR(accommodation.deposit)}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">
                    Available Rooms
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {accommodation.available_rooms}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">
                    Gender Preference
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {accommodation.gender_preference}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-base font-semibold text-gray-900">
                  About This Accommodation
                </h2>
                <p className="mt-2 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {accommodation.description}
                </p>
              </div>

              {/* Facilities */}
              <div className="mt-6">
                <h2 className="text-base font-semibold text-gray-900">
                  Facilities
                </h2>
                {accommodation.facilities?.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {accommodation.facilities.map((facility) => (
                      <span
                        key={facility}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    No specific facilities listed.
                  </p>
                )}
              </div>

              {/* Privacy-Protected Address & Contact Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-base font-semibold text-gray-900">
                  Address & Owner Contact
                </h2>
                {accommodation.address && accommodation.contact_phone ? (
                  <div className="mt-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1 text-sm text-emerald-950">
                    {accommodation.owner_name && (
                      <p>
                        <strong>Owner:</strong> {accommodation.owner_name}
                      </p>
                    )}
                    <p>
                      <strong>Exact Address:</strong> {accommodation.address}
                    </p>
                    <p>
                      <strong>Contact Phone:</strong>{" "}
                      <a
                        href={`tel:${accommodation.contact_phone}`}
                        className="font-semibold underline"
                      >
                        {accommodation.contact_phone}
                      </a>
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 p-4 rounded-xl bg-gray-100 border border-gray-200 text-xs text-gray-600 leading-relaxed">
                    For the safety and privacy of residents and property owners,
                    the exact street address and contact phone number are shown
                    only after the owner <strong>accepts</strong> your booking
                    request.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Action Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Request to Book
            </h2>
            <p className="mt-1 text-xs text-gray-600">
              Send your preferred move-in date and a short introduction to the
              property owner.
            </p>

            {bookingError && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {bookingError}
              </div>
            )}

            {bookingSuccess && (
              <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                {bookingSuccess}
              </div>
            )}

            {/* Case 1: Current user is the owner of this listing */}
            {accommodation.is_owner ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-gray-700">
                  You are the owner of this accommodation listing.
                </p>
                <Link
                  to={`/owner/accommodations/${accommodation.id}/edit`}
                  className="block w-full text-center py-2.5 px-4 rounded-lg text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900"
                >
                  Edit This Listing
                </Link>
              </div>
            ) : !user ? (
              /* Case 2: Visitor is not logged in */
              <div className="mt-5 space-y-3">
                <p className="text-sm text-gray-700">
                  Please log in or register as a student to send a booking
                  request.
                </p>
                <Link
                  to="/login"
                  state={{ from: `/accommodations/${accommodation.id}` }}
                  className="block w-full text-center py-2.5 px-4 rounded-lg text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900"
                >
                  Log In to Book
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center py-2.5 px-4 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Create Student Account
                </Link>
              </div>
            ) : user.role !== "student" ? (
              /* Case 3: Logged in as another Owner */
              <div className="mt-4 p-3 rounded-lg bg-gray-100 text-xs text-gray-700">
                Only student accounts can submit booking requests.
              </div>
            ) : hasActiveBooking ? (
              /* Case 4: Student already has a Pending or Accepted booking here */
              <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">
                    Your Request Status
                  </span>
                  <StatusBadge status={myBooking.status} />
                </div>
                <p className="text-xs text-gray-700">
                  Preferred Move-In Date:{" "}
                  <strong>{myBooking.move_in_date}</strong>
                </p>
                {myBooking.status === "Pending" && (
                  <button
                    type="button"
                    onClick={() => handleCancelBooking(myBooking.id)}
                    className="w-full py-2 px-3 rounded-lg border border-red-300 text-xs font-semibold text-red-700 hover:bg-red-50 cursor-pointer"
                  >
                    Cancel Pending Request
                  </button>
                )}
                <Link
                  to="/student/bookings"
                  className="block text-center text-xs font-semibold text-emerald-800 hover:underline"
                >
                  View all my booking requests &rarr;
                </Link>
              </div>
            ) : !isAvailable ? (
              /* Case 5: Listing is not available */
              <div className="mt-4 p-3 rounded-lg bg-gray-100 text-xs text-gray-700">
                This accommodation is currently full or not accepting new
                booking requests.
              </div>
            ) : (
              /* Case 6: Logged-in Student can submit a booking request */
              <form onSubmit={handleBookingSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase">
                    Preferred Move-In Date *
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase">
                    Message to Owner
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Introduce yourself (university, year of study, how long you plan to stay)..."
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900 disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {bookingSubmitting
                    ? "Sending Request..."
                    : "Submit Booking Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
