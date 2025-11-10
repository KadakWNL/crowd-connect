import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../services/api';
import '../styles/AttendeesList.css';

function AttendeesList({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        
        // Check if user is the host of this event
        // Handle both populated (object with _id) and non-populated (string) hostUserId
        const hostId = data.hostUserId?._id 
          ? data.hostUserId._id.toString() 
          : data.hostUserId?.toString();
        
        if (!user || hostId !== user.id.toString()) {
          navigate('/');
          return;
        }
        
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user, navigate]);

  if (loading) {
    return <div className="loading">Loading attendees...</div>;
  }

  if (!event) {
    return null;
  }

  return (
    <div className="attendees-container">
      <h2>Attendees for "{event.title}"</h2>
      
      <div className="stats-section">
        <div className="stat-card">
          <h3>Total Interested</h3>
          <p>{event.attendees?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Event Date</h3>
          <p>{new Date(event.date).toLocaleDateString('en-GB').replace(/\//g, '-')}</p>
        </div>
      </div>

      {!event.attendees || event.attendees.length === 0 ? (
        <div className="no-attendees">
          <p>No one has shown interest in this event yet.</p>
        </div>
      ) : (
        <div className="attendees-grid">
          {event.attendees.map(attendee => (
            <div key={attendee._id} className="attendee-card">
              <div className="attendee-avatar">
                {attendee.username?.charAt(0).toUpperCase()}
              </div>
              <div className="attendee-info">
                <h3>{attendee.username}</h3>
                <p>{attendee.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AttendeesList;
