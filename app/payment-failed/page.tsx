'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50 flex items-center justify-center min-h-screen py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-8">
              Your payment could not be processed. Please try again or contact support if the problem persists.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => router.back()}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Back to Events
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Need help?{' '}
              <a href="mailto:support@eventpass.com" className="text-primary-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
