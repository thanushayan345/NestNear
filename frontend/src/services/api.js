/**
 * Simple Fetch API helper for talking to the Flask backend.
 * Handles session cookies, CSRF tokens, JSON bodies, and FormData image uploads.
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

let csrfToken = null;

export function setCsrfToken(token) {
  if (token) {
    csrfToken = token;
  }
}

export function resolveImageUrl(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `${API_BASE}${imageUrl}`;
}

export function formatLKR(amount) {
  const num = Number(amount || 0);
  return `LKR ${num.toLocaleString("en-LK")}`;
}

async function ensureCsrfToken() {
  if (csrfToken) return csrfToken;
  const response = await fetch(`${API_BASE}/api/csrf-token`, {
    method: "GET",
    credentials: "include",
  });
  if (response.ok) {
    const data = await response.json();
    csrfToken = data.csrf_token;
  }
  return csrfToken;
}

export async function apiRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = { ...(options.headers || {}) };

  const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  if (isMutating) {
    const token = await ensureCsrfToken();
    if (token) {
      headers["X-CSRF-Token"] = token;
    }
  }

  let body = options.body;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (body && !isFormData && typeof body === "object") {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body,
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (data && data.csrf_token) {
    csrfToken = data.csrf_token;
  }

  // If CSRF expired, refresh once and retry
  if (response.status === 403 && data?.code === "csrf_failed" && !options._retried) {
    csrfToken = null;
    await ensureCsrfToken();
    return apiRequest(path, { ...options, _retried: true });
  }

  if (!response.ok) {
    const error = new Error(data.error || "Request failed. Please try again.");
    error.status = response.status;
    error.errors = data.errors || {};
    error.code = data.code;
    throw error;
  }

  return data;
}

// --- Specific API calls ---

export const authApi = {
  me: () => apiRequest("/api/me"),
  login: (credentials) =>
    apiRequest("/api/login", { method: "POST", body: credentials }),
  register: (payload) =>
    apiRequest("/api/register", { method: "POST", body: payload }),
  logout: () => apiRequest("/api/logout", { method: "POST" }),
};

export const accommodationApi = {
  getOptions: () => apiRequest("/api/options"),
  list: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        searchParams.set(key, String(value).trim());
      }
    });
    const query = searchParams.toString();
    return apiRequest(`/api/accommodations${query ? `?${query}` : ""}`);
  },
  getById: (id) => apiRequest(`/api/accommodations/${id}`),
  listMine: () => apiRequest("/api/owner/accommodations"),
  create: (formData) =>
    apiRequest("/api/accommodations", { method: "POST", body: formData }),
  update: (id, formData) =>
    apiRequest(`/api/accommodations/${id}`, { method: "PUT", body: formData }),
  updateAvailability: (id, isAvailable) =>
    apiRequest(`/api/accommodations/${id}/availability`, {
      method: "PATCH",
      body: { is_available: isAvailable },
    }),
  remove: (id) =>
    apiRequest(`/api/accommodations/${id}`, { method: "DELETE" }),
};

export const bookingApi = {
  create: (payload) =>
    apiRequest("/api/bookings", { method: "POST", body: payload }),
  listStudent: () => apiRequest("/api/student/bookings"),
  listOwner: (status = "") => {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    return apiRequest(`/api/owner/bookings${query}`);
  },
  updateStatus: (id, status) =>
    apiRequest(`/api/bookings/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),
  cancel: (id) =>
    apiRequest(`/api/bookings/${id}/cancel`, { method: "PATCH" }),
};
