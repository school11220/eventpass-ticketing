'use client';

import { useEffect, useState } from 'react';
import EventCard from '@/components/EventCard';
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
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        if (data.events && data.events.length > 0) {
          setEvents(data.events);
        } else {
          // Show mock event if database returns no events
          setEvents([MOCK_EVENT]);
        }
      } else {
        // Show mock event if API fails
        setEvents([MOCK_EVENT]);
      }
    } catch (err) {
      // Show mock event if fetch fails
      console.log('Using mock event data');
      setEvents([MOCK_EVENT]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Events Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No events available
              </h3>
              <p className="text-gray-500">Check back soon for new events!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
