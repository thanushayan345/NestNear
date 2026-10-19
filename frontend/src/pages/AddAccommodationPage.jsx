import { Link, useNavigate } from "react-router-dom";
import AccommodationForm from "../components/AccommodationForm";
import { accommodationApi } from "../services/api";

export default function AddAccommodationPage() {
  const navigate = useNavigate();

  async function handleCreate(formData) {
    const data = await accommodationApi.create(formData);
    navigate(`/accommodations/${data.accommodation.id}`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          to="/owner/dashboard"
          className="text-sm font-medium text-emerald-800 hover:underline"
        >
          &larr; Back to Owner Dashboard
        </Link>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
          Add New Accommodation
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Publish a room, boarding house, or annex for university students.
        </p>
      </div>

      <AccommodationForm
        onSubmit={handleCreate}
        submitLabel="Publish Listing"
        requireImage={true}
      />
    </div>
  );
}
