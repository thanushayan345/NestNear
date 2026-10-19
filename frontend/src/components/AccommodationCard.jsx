import { Link } from "react-router-dom";
import { formatLKR, resolveImageUrl } from "../services/api";
import StatusBadge from "./StatusBadge";

export default function AccommodationCard({ accommodation }) {
  const imageSrc = resolveImageUrl(accommodation.image_url);
  const isAvailable =
    accommodation.is_available && accommodation.available_rooms > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Photo */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={accommodation.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Photo Available
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-900/90 text-white">
            {accommodation.accommodation_type}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge
            status={isAvailable ? "Available" : "Not Available"}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs font-medium text-emerald-800">
            {accommodation.town}, {accommodation.district}
          </p>
          <h3 className="mt-1 text-base font-semibold text-gray-900 line-clamp-1">
            {accommodation.title}
          </h3>
          <p className="mt-1 text-xs text-gray-600 line-clamp-1">
            Near: {accommodation.nearby_university}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>
              Rooms: <strong className="text-gray-700">{accommodation.available_rooms}</strong>
            </span>
            <span>•</span>
            <span>
              Gender: <strong className="text-gray-700">{accommodation.gender_preference}</strong>
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-emerald-800">
              {formatLKR(accommodation.monthly_rent)}
            </span>
            <span className="text-xs text-gray-500"> / month</span>
          </div>
          <Link
            to={`/accommodations/${accommodation.id}`}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
