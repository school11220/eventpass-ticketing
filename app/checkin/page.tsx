'use client';

import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface CheckInResult {
  success: boolean;
  message?: string;
  error?: string;
  ticket?: {
    id: string;
    eventName: string;
    eventDate: string;
    venue: string;
    attendeeName: string;
    attendeeEmail: string;
    checkedInAt?: string;
  };
  checkedInAt?: string;
}

export default function CheckInPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [manualToken, setManualToken] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const qrReaderRef = useRef<any>(null);

  useEffect(() => {
    // Check if admin is already logged in
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }

    return () => {
      stopScanning();
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid password. Try "admin123"');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    stopScanning();
  };

  const startScanning = async () => {
    try {
      setResult(null);
      setCameraError('');
      setScanning(true);

      console.log('🎥 Initializing html5-qrcode scanner...');

      // Dynamically import to avoid SSR issues
      const { Html5Qrcode } = await import('html5-qrcode');
      
      const qrReader = new Html5Qrcode("qr-reader");
      qrReaderRef.current = qrReader;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await qrReader.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          console.log('✅ QR Code scanned:', decodedText);
          checkTicket(decodedText);
          stopScanning();
        },
        (errorMessage) => {
          // Ignore scanning errors (just means no QR in view)
        }
      );

      console.log('✅ Scanner started successfully!');
    } catch (error: any) {
      console.error('❌ Camera error:', error);
      
      let errorMessage = '';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera access denied. Please allow camera permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please check your camera connection.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is in use by another application. Please close it and try again.';
      } else {
        errorMessage = `Camera error: ${error.message || 'Unknown error'}. Please use manual entry below.`;
      }
      
      setCameraError(errorMessage);
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrReaderRef.current) {
      qrReaderRef.current.stop()
        .then(() => {
          console.log('Scanner stopped');
          qrReaderRef.current = null;
        })
        .catch((err: any) => {
          console.error('Error stopping scanner:', err);
        });
    }
    setScanning(false);
  };

  const checkTicket = async (token: string) => {
    setProcessing(true);
    try {
      const response = await fetch(`/api/check-ticket?token=${encodeURIComponent(token)}`);
      const data = await response.json();

      setResult(data);

      // Auto-clear result after 5 seconds for success
      if (data.success) {
        setTimeout(() => {
          setResult(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Error checking ticket:', error);
      setResult({
        success: false,
        error: 'Failed to check ticket. Please try again.',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleManualCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) {
      alert('Please enter a ticket token');
      return;
    }
    await checkTicket(manualToken.trim());
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-gray-50 py-12 flex items-center justify-center min-h-screen">
          <div className="max-w-md w-full mx-auto px-4">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🔐</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Admin Login
                </h1>
                <p className="text-gray-600">
                  Enter password to access check-in scanner
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter admin password"
                    required
                  />
                </div>

                {authError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{authError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300"
                >
                  Login
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Default password: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
                </p>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🎫 Ticket Check-In
              </h1>
              <p className="text-lg text-gray-600">
                Scan QR codes or enter ticket tokens manually to check in attendees
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Camera Error */}
          {cameraError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-1">Camera Access Issue</h3>
                  <p className="text-yellow-800 text-sm mb-3">{cameraError}</p>
                  <div className="bg-yellow-100 rounded-lg p-3">
                    <p className="text-sm text-yellow-900 font-medium mb-2">💡 How to fix:</p>
                    <ol className="text-sm text-yellow-800 space-y-1 ml-4 list-decimal">
                      <li>Look for the camera icon in your browser's address bar</li>
                      <li>Click it and select "Allow" for camera access</li>
                      <li>Click "Start Scanning" again</li>
                      <li>If that doesn't work, use "Manual Entry" below</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QR Scanner */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Camera Scanner
            </h2>

            <div className="mb-6">
              {!scanning ? (
                <div className="text-center">
                  <div className="bg-gray-100 rounded-lg p-12 mb-4">
                    <svg
                      className="w-24 h-24 mx-auto text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    <p className="text-gray-600">Camera is ready</p>
                  </div>
                  <button
                    onClick={startScanning}
                    className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300"
                  >
                    Start Scanning
                  </button>
                </div>
              ) : (
                <div>
                  <div 
                    id="qr-reader" 
                    className="rounded-lg overflow-hidden mb-4"
                    style={{ width: '100%' }}
                  />
                  <button
                    onClick={stopScanning}
                    className="w-full bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Stop Scanning
                  </button>
                </div>
              )}
            </div>

            {processing && (
              <div className="text-center py-4">
                <div className="spinner mx-auto mb-2"></div>
                <p className="text-gray-600">Checking ticket...</p>
              </div>
            )}

            {/* Result Display */}
            {result && !processing && (
              <div
                className={`p-6 rounded-lg ${
                  result.success
                    ? 'bg-green-50 border-2 border-green-500'
                    : 'bg-red-50 border-2 border-red-500'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {result.success ? (
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-8 h-8 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3
                      className={`text-xl font-bold mb-2 ${
                        result.success ? 'text-green-900' : 'text-red-900'
                      }`}
                    >
                      {result.success ? '✅ Check-In Successful!' : '❌ Check-In Failed'}
                    </h3>
                    {result.ticket && (
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Event:</strong> {result.ticket.eventName}
                        </p>
                        <p>
                          <strong>Attendee:</strong> {result.ticket.attendeeName}
                        </p>
                        <p>
                          <strong>Email:</strong> {result.ticket.attendeeEmail}
                        </p>
                        <p>
                          <strong>Venue:</strong> {result.ticket.venue}
                        </p>
                      </div>
                    )}
                    <p
                      className={`mt-2 ${
                        result.success ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {result.message || result.error}
                    </p>
                    {result.checkedInAt && (
                      <p className="text-red-700 text-sm mt-2">
                        Previously checked in at:{' '}
                        {new Date(result.checkedInAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Manual Entry */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Manual Token Entry
            </h2>
            <form onSubmit={handleManualCheck} className="space-y-4">
              <div>
                <label
                  htmlFor="token"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ticket Token
                </label>
                <input
                  type="text"
                  id="token"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Paste ticket token here"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={processing || !manualToken.trim()}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Checking...' : 'Check Ticket'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
