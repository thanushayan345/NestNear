import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AccommodationForm from "../components/AccommodationForm";
import { accommodationApi } from "../services/api";

export default function EditAccommodationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    accommodationApi
      .getById(id)
      .then((data) => {
        if (!data.accommodation?.is_owner) {
          setError("You can only edit your own accommodation listings.");
        } else {
          setInitialValues(data.accommodation);
        }
      })
      .catch((err) => setError(err.message || "Could not load accommodation."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleUpdate(formData) {
    const data = await accommodationApi.update(id, formData);
    navigate(`/accommodations/${data.accommodation.id}`);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500 text-sm">
        Loading listing details...
      </div>
    );
  }

  if (error || !initialValues) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900">
            {error || "Listing not found"}
          </h2>
          <Link
            to="/owner/dashboard"
            className="mt-4 inline-block px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900"
          >
            Back to Owner Dashboard
          </Link>
        </div>
      </div>
    );
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
          Edit Accommodation
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Update monthly rent, deposit, facilities, photo, or room availability.
        </p>
      </div>

      <AccommodationForm
        initialValues={initialValues}
        onSubmit={handleUpdate}
        submitLabel="Save Changes"
        requireImage={false}
      />
    </div>
  );
}
