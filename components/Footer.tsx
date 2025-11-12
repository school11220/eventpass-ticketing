export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a
              href="#"
              className="text-gray-400 hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="#"
              className="text-gray-400 hover:text-primary-400 transition-colors"
            >
              Terms & Conditions
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="#"
              className="text-gray-400 hover:text-primary-400 transition-colors"
            >
              Refund Policy
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="#"
              className="text-gray-400 hover:text-primary-400 transition-colors"
            >
              Cancellation Policy
            </a>
          </div>

          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2025 EventPass. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
