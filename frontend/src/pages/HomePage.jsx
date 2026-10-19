import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccommodationCard from "../components/AccommodationCard";
import { accommodationApi } from "../services/api";

export default function HomePage() {
  const navigate = useNavigate();
  const [options, setOptions] = useState({ districts: [], universities: [] });
  const [district, setDistrict] = useState("");
  const [university, setUniversity] = useState("");
  const [maxRent, setMaxRent] = useState("");

  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    accommodationApi
      .getOptions()
      .then((data) => setOptions(data))
      .catch(() => {});

    accommodationApi
      .list({ limit: 6 })
      .then((data) => setFeatured(data.accommodations || []))
      .catch((err) => setError(err.message || "Could not load accommodations."))
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (district) params.set("district", district);
    if (university) params.set("university", university);
    if (maxRent) params.set("max_rent", maxRent);
    navigate(`/accommodations?${params.toString()}`);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-emerald-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800 text-amber-300 mb-4">
              Sri Lanka Student Housing Platform
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Find Your Perfect Student Accommodation
            </h1>
            <p className="mt-4 text-base sm:text-lg text-emerald-100 leading-relaxed">
              Browse verified rooms, boarding houses, and annexes near Sri
              Lankan universities. Compare monthly rent in LKR and send booking
              requests directly to property owners.
            </p>
          </div>

          {/* Search Form for District, University, and Maximum Monthly Rent */}
          <form
            onSubmit={handleSearch}
            className="mt-8 bg-white text-gray-900 p-4 sm:p-6 rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
          >
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                District
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-700 focus:outline-none"
              >
                <option value="">All Districts</option>
                {options.districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                University
              </label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-700 focus:outline-none"
              >
                <option value="">All Universities</option>
                {options.universities.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Max Monthly Rent (LKR)
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
                placeholder="e.g. 25000"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-700 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-5 rounded-lg font-semibold text-sm bg-emerald-800 text-white hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              Search Accommodation
            </button>
          </form>
        </div>
      </section>

      {/* Featured Accommodations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Student Accommodations
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Explore rooms, boarding houses, and annexes near major campuses.
            </p>
          </div>
          <Link
            to="/accommodations"
            className="text-sm font-semibold text-emerald-800 hover:text-emerald-950"
          >
            View all listings &rarr;
          </Link>
        </div>

        {loading && (
          <div className="py-12 text-center text-gray-500 text-sm">
            Loading accommodations...
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && featured.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-600">
            No accommodations found yet.
          </div>
        )}

        {!loading && !error && featured.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((item) => (
              <AccommodationCard key={item.id} accommodation={item} />
            ))}
          </div>
        )}
      </section>

      {/* How NestNear Works Section */}
      <section className="bg-gray-100 py-14 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900">
              How NestNear Works
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              A simple, safe workflow for university students and property
              owners across Sri Lanka.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                Search Near Your Campus
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Filter rooms, boarding houses, and annexes by Sri Lankan
                district, town, nearby university, and your monthly budget in
                LKR.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                Send a Booking Request
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Pick your preferred move-in date and send a message to the
                property owner. Your request starts with Pending status.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                Get Confirmed & Move In
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Once the owner accepts your request, the exact street address
                and owner phone number are unlocked on your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
