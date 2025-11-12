import { useState, useEffect } from 'react';
import { getMyEvents } from '../services/api';
import '../styles/UserProfile.css';
import EventCard from '../components/EventCard';

function UserProfile({ user }) {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const events = await getMyEvents();
        setMyEvents(events);
      } catch (err) {
        setError('Could not fetch your events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [user]);

  if (!user) {
    return (
      <div className="user-profile-container">
        <p>Please log in to see your profile.</p>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-details-card">
        <div className="profile-info-item">
          <strong>Username:</strong>
          <span>{user.username}</span>
        </div>
        <div className="profile-info-item">
          <strong>Email:</strong>
          <span>{user.email}</span>
        </div>
        <div className="profile-info-item">
          <strong>Status:</strong>
          <span>{user.isHost ? 'Host' : 'Attendee'}</span>
        </div>
      </div>

      <div className="my-events-section">
        <h2>My Registered Events</h2>
        {loading && <div className="loading">Loading your events...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && (
          <div className="events-grid">
            {myEvents.length > 0 ? (
              myEvents.map(event => <EventCard key={event._id} event={event} />)
            ) : (
              <div className="no-events">
                <p>You haven't registered for any events yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
