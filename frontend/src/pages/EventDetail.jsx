import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { getEventById, toggleAttendEvent, getCurrentUser } from '../services/api';
import '../styles/EventDetail.css';
import 'leaflet/dist/leaflet.css';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAttending, setIsAttending] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [attendLoading, setAttendLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event
        const eventData = await getEventById(id);
        setEvent(eventData);
        setAttendeeCount(eventData.attendees?.length || 0);

        // Fetch current user if logged in
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userData = await getCurrentUser();
            setUser(userData);
            // Check if user is attending by looking at their own attending list
            setIsAttending(userData.attending?.includes(id) || false);
          } catch (err) {
            // User not logged in or token invalid
            console.log('User not logged in');
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load event');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAttendClick = async () => {
    if (!user) {
      alert('Please login to mark your interest in this event!');
      navigate('/login');
      return;
    }

    setAttendLoading(true);
    try {
      const response = await toggleAttendEvent(id);
      setIsAttending(response.isAttending);
      setAttendeeCount(response.attendeeCount);
    } catch (error) {
      console.error('Error toggling attendance:', error);
      alert('Failed to update attendance. Please try again.');
    } finally {
      setAttendLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading event...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!event) return <div className="error">Event not found</div>;

  return (
    <div className="event-detail">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      
      <div className="event-detail-header">
        <h1>{event.title}</h1>
        <span className="event-category-badge">{event.category}</span>
      </div>

      <div className="event-detail-content">
        <div className="event-info">
          <div className="info-row">
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-GB').replace(/\//g, '-')}
          </div>
          <div className="info-row">
            <strong>Time:</strong> {event.time}
          </div>
          <div className="info-row">
            <strong>Location:</strong> {event.locationName}
          </div>
          <div className="info-row">
            <strong>Host:</strong> {event.hostUserId?.username || 'Unknown'}
          </div>
          <div className="info-row description">
            <strong>Description:</strong>
            <p>{event.description}</p>
          </div>
        </div>

        <div className="event-map">
          <h3>Event Location</h3>
          <MapContainer
            center={[event.latitude, event.longitude]}
            zoom={14}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[event.latitude, event.longitude]} />
          </MapContainer>
        </div>
      </div>

      <div className="event-attendance">
        <div className="attendance-info">
          <div className="attendee-count">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>
              <strong>{attendeeCount}</strong> {attendeeCount === 1 ? 'person' : 'people'} interested
            </span>
          </div>
        </div>
        <button 
          onClick={handleAttendClick}
          className={`interest-btn ${isAttending ? 'attending' : ''}`}
          disabled={attendLoading}
        >
          {attendLoading ? 'Loading...' : isAttending ? '✓ You\'re Interested' : 'I\'m Interested!'}
        </button>
      </div>
    </div>
  );
}

export default EventDetail;
