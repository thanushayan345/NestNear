import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AccommodationCard from "../components/AccommodationCard";
import { accommodationApi } from "../services/api";

export default function AccommodationSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [options, setOptions] = useState({
    districts: [],
    universities: [],
    accommodation_types: ["Room", "Boarding House", "Annex"],
    gender_preferences: ["Any", "Male", "Female"],
  });

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    district: searchParams.get("district") || "",
    town: searchParams.get("town") || "",
    university: searchParams.get("university") || "",
    type: searchParams.get("type") || "",
    gender: searchParams.get("gender") || "",
    max_rent: searchParams.get("max_rent") || "",
    available_only: searchParams.get("available_only") === "true",
    sort: searchParams.get("sort") || "newest",
  });

  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    accommodationApi
      .getOptions()
      .then((data) => setOptions(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchListings(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchListings(activeFilters) {
    setLoading(true);
    setError("");
    try {
      const data = await accommodationApi.list({
        ...activeFilters,
        available_only: activeFilters.available_only ? "true" : "",
      });
      setAccommodations(data.accommodations || []);
    } catch (err) {
      setError(err.message || "Could not load accommodations.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextParams = {};
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== "" && val !== false) {
        nextParams[key] = String(val);
      }
    });
    setSearchParams(nextParams);
    fetchListings(filters);
  }

  function handleReset() {
    const cleared = {
      q: "",
      district: "",
      town: "",
      university: "",
      type: "",
      gender: "",
      max_rent: "",
      available_only: false,
      sort: "newest",
    };
    setFilters(cleared);
    setSearchParams({});
    fetchListings(cleared);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Find Student Accommodation
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Search by district, town, or university and filter by maximum monthly
          rent.
        </p>
      </div>

      {/* Filter Bar */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-8 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase">
              Town or Keyword
            </label>
            <input
              type="text"
              name="q"
              value={filters.q}
              onChange={handleChange}
              placeholder="e.g. Nugegoda, Katubedda, Peradeniya"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase">
              District
            </label>
            <select
              name="district"
              value={filters.district}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
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
            <label className="block text-xs font-semibold text-gray-700 uppercase">
              Nearby University
            </label>
            <select
              name="university"
              value={filters.university}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
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
            <label className="block text-xs font-semibold text-gray-700 uppercase">
              Max Monthly Rent (LKR)
            </label>
            <input
              type="number"
              name="max_rent"
              min="1000"
              step="500"
              value={filters.max_rent}
              onChange={handleChange}
              placeholder="e.g. 25000"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end pt-2 border-t border-gray-100">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase">
              Accommodation Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
            >
              <option value="">All Types</option>
              {options.accommodation_types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase">
              Gender Preference
            </label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
            >
              <option value="">Any Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase">
              Sort By
            </label>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Rent: Low to High</option>
              <option value="price_desc">Rent: High to Low</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="available_only"
                checked={filters.available_only}
                onChange={handleChange}
                className="accent-emerald-800"
              />
              <span>Available only</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900 cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Results */}
      {loading && (
        <div className="py-16 text-center text-gray-500 text-sm">
          Searching accommodations...
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && accommodations.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <h3 className="text-base font-semibold text-gray-900">
            No matching accommodations found
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Try clearing one or more filters or increasing your maximum monthly
            rent.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900 cursor-pointer"
          >
            Show All Accommodations
          </button>
        </div>
      )}

      {!loading && !error && accommodations.length > 0 && (
        <>
          <p className="mb-4 text-xs text-gray-500">
            Showing <strong>{accommodations.length}</strong> accommodation
            {accommodations.length === 1 ? "" : "s"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodations.map((item) => (
              <AccommodationCard key={item.id} accommodation={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
