'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock event data to show when database is not connected
const MOCK_EVENT = {
  id: 'mock-comedy-show',
  name: 'Comedy Night Live',
  description: 'An evening of laughter with top stand-up comedians. Get ready for non-stop entertainment!',
  date: '2025-12-20T20:00:00',
  venue: 'The Laugh Factory, Mumbai',
  price: 200,
  image_url: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800'
};

export default function Home() {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        if (data.events && data.events.length > 0) {
          setEvent(data.events[0]); // Show first event
        } else {
          setEvent(MOCK_EVENT);
        }
      } else {
        setEvent(MOCK_EVENT);
      }
    } catch (err) {
      console.log('Using mock event data');
      setEvent(MOCK_EVENT);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTicket = () => {
    if (event) {
      router.push(`/event/${event.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {loading ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading event...</p>
            </div>
          </div>
        ) : event ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Image */}
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl mb-8">
              <img
                src={event.image_url}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full text-white font-bold text-lg mb-4">
                  ₹{event.price}
                </div>
                <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
                  {event.name}
                </h1>
              </div>
            </div>

            {/* Event Details Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Date & Time */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Date & Time</h3>
                    <p className="text-xl font-bold text-gray-900">{formatDate(event.date)}</p>
                    <p className="text-lg text-gray-600">at {formatTime(event.date)}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Venue</h3>
                    <p className="text-xl font-bold text-gray-900">{event.venue}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Buy Ticket Button */}
              <button
                onClick={handleBuyTicket}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-xl py-5 px-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <span>Get Your Ticket Now</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <div className="text-gray-400 text-8xl mb-6">🎫</div>
              <h3 className="text-3xl font-bold text-gray-700 mb-3">
                No Event Available
              </h3>
              <p className="text-xl text-gray-500">Check back soon for exciting events!</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
