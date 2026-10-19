import { useEffect, useState } from "react";
import { accommodationApi, resolveImageUrl } from "../services/api";

const DEFAULT_VALUES = {
  title: "",
  description: "",
  accommodation_type: "Room",
  district: "Colombo",
  town: "",
  nearby_university: "University of Colombo",
  monthly_rent: "",
  deposit: "0",
  facilities: [],
  available_rooms: "1",
  gender_preference: "Any",
  address: "",
  contact_phone: "",
  is_available: true,
};

export default function AccommodationForm({
  initialValues = null,
  onSubmit,
  submitLabel = "Save Accommodation",
  requireImage = true,
}) {
  const [options, setOptions] = useState({
    districts: [],
    universities: [],
    accommodation_types: ["Room", "Boarding House", "Annex"],
    gender_preferences: ["Any", "Male", "Female"],
    facilities: [],
  });
  const [values, setValues] = useState({ ...DEFAULT_VALUES });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    accommodationApi
      .getOptions()
      .then((data) => setOptions(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialValues) {
      setValues({
        title: initialValues.title || "",
        description: initialValues.description || "",
        accommodation_type: initialValues.accommodation_type || "Room",
        district: initialValues.district || "Colombo",
        town: initialValues.town || "",
        nearby_university:
          initialValues.nearby_university || "University of Colombo",
        monthly_rent: String(initialValues.monthly_rent ?? ""),
        deposit: String(initialValues.deposit ?? "0"),
        facilities: Array.isArray(initialValues.facilities)
          ? initialValues.facilities
          : [],
        available_rooms: String(initialValues.available_rooms ?? "1"),
        gender_preference: initialValues.gender_preference || "Any",
        address: initialValues.address || "",
        contact_phone: initialValues.contact_phone || "",
        is_available: Boolean(initialValues.is_available),
      });
      if (initialValues.image_url) {
        setPreviewUrl(resolveImageUrl(initialValues.image_url));
      }
    }
  }, [initialValues]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function toggleFacility(facility) {
    setValues((prev) => {
      const exists = prev.facilities.includes(facility);
      const next = exists
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility];
      return { ...prev, facilities: next };
    });
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setFieldErrors({});
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("accommodation_type", values.accommodation_type);
      formData.append("district", values.district);
      formData.append("town", values.town);
      formData.append("nearby_university", values.nearby_university);
      formData.append("monthly_rent", values.monthly_rent);
      formData.append("deposit", values.deposit || "0");
      formData.append("facilities", values.facilities.join(","));
      formData.append("available_rooms", values.available_rooms);
      formData.append("gender_preference", values.gender_preference);
      formData.append("address", values.address);
      formData.append("contact_phone", values.contact_phone);
      formData.append("is_available", values.is_available ? "true" : "false");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await onSubmit(formData);
    } catch (err) {
      setErrorMessage(err.message || "Could not save accommodation.");
      setFieldErrors(err.errors || {});
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
    >
      {errorMessage && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Title & Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Listing Title *
          </label>
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="e.g. Quiet single room near University of Moratuwa"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
          />
          {fieldErrors.title && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Accommodation Type *
          </label>
          <select
            name="accommodation_type"
            value={values.accommodation_type}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
          >
            {options.accommodation_types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {fieldErrors.accommodation_type && (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.accommodation_type}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          name="description"
          rows={4}
          value={values.description}
          onChange={handleChange}
          placeholder="Describe the room, distance to campus, house rules, and bills included..."
          required
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
        />
        {fieldErrors.description && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>
        )}
      </div>

      {/* Location: District, Town, Nearby University */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            District *
          </label>
          <select
            name="district"
            value={values.district}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
          >
            {options.districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {fieldErrors.district && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.district}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Town / Suburb *
          </label>
          <input
            type="text"
            name="town"
            value={values.town}
            onChange={handleChange}
            placeholder="e.g. Katubedda, Nugegoda, Peradeniya"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
          />
          {fieldErrors.town && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.town}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nearby University *
          </label>
          <select
            name="nearby_university"
            value={values.nearby_university}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
          >
            {options.universities.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          {fieldErrors.nearby_university && (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.nearby_university}
            </p>
          )}
        </div>
      </div>

      {/* Pricing, Rooms & Gender Preference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Monthly Rent (LKR) *
          </label>
          <input
            type="number"
            name="monthly_rent"
            min="1000"
            max="500000"
            value={values.monthly_rent}
            onChange={handleChange}
            placeholder="18000"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
          />
          {fieldErrors.monthly_rent && (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.monthly_rent}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Key Money / Deposit (LKR)
          </label>
          <input
            type="number"
            name="deposit"
            min="0"
            max="2000000"
            value={values.deposit}
            onChange={handleChange}
            placeholder="36000"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
          />
          {fieldErrors.deposit && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.deposit}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Available Rooms *
          </label>
          <input
            type="number"
            name="available_rooms"
            min="0"
            max="100"
            value={values.available_rooms}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
          />
          {fieldErrors.available_rooms && (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.available_rooms}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender Preference
          </label>
          <select
            name="gender_preference"
            value={values.gender_preference}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
          >
            {options.gender_preferences.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          {fieldErrors.gender_preference && (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.gender_preference}
            </p>
          )}
        </div>
      </div>

      {/* Facilities Checkboxes */}
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">
          Facilities Included
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {options.facilities.map((facility) => {
            const selected = values.facilities.includes(facility);
            return (
              <label
                key={facility}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                  selected
                    ? "bg-emerald-50 border-emerald-700 text-emerald-900"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleFacility(facility)}
                  className="accent-emerald-800"
                />
                <span>{facility}</span>
              </label>
            );
          })}
        </div>
        {fieldErrors.facilities && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.facilities}</p>
        )}
      </div>

      {/* Private Address & Contact Phone (shared only after booking is accepted) */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
        <p className="text-xs text-gray-600">
          <strong>Privacy Notice:</strong> Your exact street address and contact
          phone number are hidden from the public and are shared with a student
          only after you accept their booking request.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Exact Street Address *
            </label>
            <input
              type="text"
              name="address"
              value={values.address}
              onChange={handleChange}
              placeholder="e.g. 42/3 Station Road, Katubedda, Moratuwa"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
            />
            {fieldErrors.address && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Phone Number *
            </label>
            <input
              type="tel"
              name="contact_phone"
              value={values.contact_phone}
              onChange={handleChange}
              placeholder="0771234567"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
            />
            {fieldErrors.contact_phone && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.contact_phone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Photo Upload & Availability Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Accommodation Photo {requireImage ? "*" : "(optional to replace)"}
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            required={requireImage}
            className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG or WEBP up to 3 MB.
          </p>
          {fieldErrors.image && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.image}</p>
          )}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Listing preview"
              className="mt-3 h-36 w-56 object-cover rounded-lg border border-gray-200"
            />
          )}
        </div>

        <div className="pt-2">
          <label className="inline-flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_available"
              checked={values.is_available}
              onChange={handleChange}
              className="w-4 h-4 accent-emerald-800"
            />
            <span className="text-sm font-medium text-gray-800">
              Mark accommodation as currently available for booking requests
            </span>
          </label>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900 disabled:opacity-60 transition-colors cursor-pointer"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
