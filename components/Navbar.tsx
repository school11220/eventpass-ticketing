export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">🤖</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-wide">
                ROBOFIESTA
              </span>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Events
            </a>
            <a
              href="/checkin"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Check-in
            </a>
            <a
              href="/admin"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Admin
            </a>
          </div>

          <div className="md:hidden">
            <button className="text-gray-700 hover:text-primary-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
