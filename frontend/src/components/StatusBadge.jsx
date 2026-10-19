/**
 * Reusable badge for booking statuses (Pending, Accepted, Rejected, Cancelled)
 * and accommodation availability (Available, Not Available).
 */
const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Accepted: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
  Cancelled: "bg-gray-100 text-gray-700 border-gray-200",
  Available: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Not Available": "bg-gray-200 text-gray-700 border-gray-300",
};

export default function StatusBadge({ status }) {
  const style =
    STATUS_STYLES[status] || "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}
    >
      {status}
    </span>
  );
}
