import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
          404 Error
        </span>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900"
          >
            Go to Home Page
          </Link>
          <Link
            to="/accommodations"
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Find Accommodation
          </Link>
        </div>
      </div>
    </div>
  );
}
