import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-xl font-bold text-white">
              Nest<span className="text-amber-400">Near</span>
            </Link>
            <p className="mt-2 text-sm text-emerald-200 leading-relaxed">
              Helping university students across Sri Lanka find safe, affordable
              rooms, boarding houses, and annexes near their campus.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/accommodations"
                  className="hover:text-white transition-colors"
                >
                  Find Accommodation
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-white transition-colors"
                >
                  Register as Student or Owner
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Contact & Support
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-emerald-200">
              <li>Email: support@nestnear.lk</li>
              <li>Phone: +94 11 234 5678</li>
              <li>Hours: Mon – Sat, 8:00 AM – 6:00 PM (SLST)</li>
              <li>Colombo, Sri Lanka</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-emerald-800 text-xs text-emerald-300 flex flex-col sm:flex-row justify-between gap-2">
          <span>
            &copy; {new Date().getFullYear()} NestNear Sri Lanka. All rights
            reserved.
          </span>
          <span>
            Exact property addresses and owner phone numbers are shared only
            after a booking is accepted.
          </span>
        </div>
      </div>
    </footer>
  );
}
