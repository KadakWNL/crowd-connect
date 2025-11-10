import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import EventCard from '../components/EventCard';
import { getAllEvents } from '../services/api';
import '../styles/Home.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        
        // Sort events by date and time (nearest first)
        const sortedEvents = data.sort((a, b) => {
          const dateTimeA = new Date(`${a.date}T${a.time}`);
          const dateTimeB = new Date(`${b.date}T${b.time}`);
          return dateTimeA - dateTimeB; // Ascending order (nearest first)
        });
        
        setEvents(sortedEvents);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Discover Local Events</h1>
        <p>Connect with your community through amazing local experiences</p>
      </div>

      <div className="events-section">
        <h2>Events Map</h2>
      </div>

      {events.length > 0 ? (
        <>
          <MapContainer
            center={[events[0].latitude, events[0].longitude]}
            zoom={10}
            style={{ height: '500px', width: '100%', borderRadius: '8px', marginBottom: '2rem' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {events.map((event) => (
              <Marker key={event._id} position={[event.latitude, event.longitude]}>
                <Popup>
                  <strong>{event.title}</strong>
                  <br />
                  {event.date} at {event.time}
                  <br />
                  <a href={`/events/${event._id}`}>View Details</a>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="events-section">
            <h2>Upcoming Events</h2>
            <div className="events-grid">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="no-events">
          <h2>No events yet</h2>
          <p>Be the first to create an event!</p>
        </div>
      )}
    </div>
  );
}

export default Home;
