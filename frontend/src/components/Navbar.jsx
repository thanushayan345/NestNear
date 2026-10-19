import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    navigate("/");
  }

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-emerald-900 text-white"
        : "text-emerald-50 hover:bg-emerald-700 hover:text-white"
    }`;

  return (
    <header className="bg-emerald-800 text-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Simple NestNear Text Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"
            onClick={() => setMenuOpen(false)}
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-900 text-amber-400 font-extrabold">
              N
            </span>
            <span>
              Nest<span className="text-amber-400">Near</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/accommodations" className={navLinkClass}>
              Find Accommodation
            </NavLink>

            {user?.role === "student" && (
              <>
                <NavLink to="/student/dashboard" className={navLinkClass}>
                  Student Dashboard
                </NavLink>
                <NavLink to="/student/bookings" className={navLinkClass}>
                  My Bookings
                </NavLink>
              </>
            )}

            {user?.role === "owner" && (
              <>
                <NavLink to="/owner/dashboard" className={navLinkClass}>
                  Owner Dashboard
                </NavLink>
                <NavLink to="/owner/accommodations/new" className={navLinkClass}>
                  Add Listing
                </NavLink>
                <NavLink to="/owner/bookings" className={navLinkClass}>
                  Booking Requests
                </NavLink>
              </>
            )}
          </nav>

          {/* Right side Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <NavLink
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-emerald-50 hover:bg-emerald-700"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-semibold bg-white text-emerald-900 hover:bg-emerald-50 transition-colors"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs bg-emerald-900 text-emerald-100 px-2.5 py-1 rounded-full capitalize">
                  {user.full_name} ({user.role})
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-emerald-900 hover:bg-emerald-950 text-white transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-emerald-100 hover:text-white hover:bg-emerald-700"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-emerald-900 border-t border-emerald-700 px-4 pt-2 pb-4 space-y-1">
          <NavLink
            to="/"
            end
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-emerald-800"
          >
            Home
          </NavLink>
          <NavLink
            to="/accommodations"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-emerald-800"
          >
            Find Accommodation
          </NavLink>

          {user?.role === "student" && (
            <>
              <NavLink
                to="/student/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-emerald-800"
              >
                Student Dashboard
              </NavLink>
              <NavLink
                to="/student/bookings"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-emerald-800"
              >
                My Bookings
              </NavLink>
            </>
          )}

          {user?.role === "owner" && (
            <>
              <NavLink
                to="/owner/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-emerald-800"
              >
                Owner Dashboard
              </NavLink>
              <NavLink
                to="/owner/accommodations/new"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-emerald-800"
              >
                Add Listing
              </NavLink>
              <NavLink
                to="/owner/bookings"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-emerald-800"
              >
                Booking Requests
              </NavLink>
            </>
          )}

          <div className="pt-2 border-t border-emerald-700">
            {!user ? (
              <div className="flex flex-col gap-2">
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-emerald-100 hover:bg-emerald-800"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-semibold bg-white text-emerald-900 text-center"
                >
                  Register
                </NavLink>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-emerald-100">
                  {user.full_name} ({user.role})
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-emerald-950 text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
