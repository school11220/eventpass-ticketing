'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Script from 'next/script';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  venue: string;
  price: number;
  image_url: string;
}

// Declare Razorpay on Window interface
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function EventDetail() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`);
      const data = await response.json();
      if (data.event) {
        setEvent(data.event);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    setProcessing(true);

    try {
      // Create order
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event?.id,
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          amount: event?.price,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Check if using mock payment (for localhost testing without credentials)
      if (orderData.useMock) {
        console.log('🧪 Using mock payment mode');
        // Redirect directly to mock payment page
        window.location.href = orderData.paymentUrl;
        return;
      }

      // Use Razorpay checkout
      if (!razorpayLoaded || !window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh and try again.');
      }

      console.log('💳 Opening Razorpay checkout...');

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ROBOFIESTA',
        description: `Ticket for ${event?.name}`,
        order_id: orderData.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#2563eb', // primary-600 blue
        },
        handler: async function (response: any) {
          console.log('✅ Payment successful:', response);
          
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/razorpay-callback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              // Redirect to ticket page with QR code
              console.log('🎫 Redirecting to ticket:', verifyData.ticketId);
              router.push(`/ticket/${verifyData.ticketId}`);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('❌ Payment verification error:', error);
            alert('Payment successful but verification failed. Please contact support with your payment ID.');
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function() {
            console.log('❌ Payment cancelled by user');
            setProcessing(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert(`Failed to process payment: ${error instanceof Error ? error.message : 'Please try again'}`);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="spinner"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Event not found
            </h2>
            <a
              href="/"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Back to events
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const eventTime = new Date(event.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {
          console.log('✅ Razorpay SDK loaded');
          setRazorpayLoaded(true);
        }}
        onError={() => {
          console.error('❌ Failed to load Razorpay SDK');
        }}
      />
      <Navbar />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {event.name}
            </h1>

            {/* Booking Form */}
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+91 1234567890"
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <div className="spinner border-white mr-2 w-5 h-5"></div>
                    Processing...
                  </span>
                ) : (
                  `Buy Ticket - ₹${event.price}`
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
