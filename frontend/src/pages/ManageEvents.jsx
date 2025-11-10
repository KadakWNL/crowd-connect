import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEvents, deleteEvent } from '../services/api';
import '../styles/ManageEvents.css';

function ManageEvents({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isHost) {
      navigate('/');
      return;
    }

    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        console.log('All events:', data);
        console.log('Current user:', user);
        
        const myEvents = data.filter(event => {
          // Handle both populated (object with _id) and non-populated (string) hostUserId
          const hostId = event.hostUserId?._id 
            ? event.hostUserId._id.toString() 
            : event.hostUserId?.toString();
          
          const match = hostId === user.id.toString();
          console.log(`Event "${event.title}" - Host: ${hostId}, User: ${user.id}, Match: ${match}`);
          
          return match;
        });
        
        console.log('My events:', myEvents);
        setEvents(myEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, navigate]);

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        setEvents(events.filter(event => event._id !== eventId));
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleViewAttendees = (eventId) => {
    navigate(`/events/${eventId}/attendees`);
  };

  if (loading) {
    return <div className="loading">Loading your events...</div>;
  }

  return (
    <div className="manage-events-container">
      <h2>Manage Your Events</h2>
      
      {events.length === 0 ? (
        <div className="no-events">
          <p>You haven't created any events yet.</p>
        </div>
      ) : (
        <div className="events-table-wrapper">
          <table className="events-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Category</th>
                <th>Attendees</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.category}</td>
                  <td>{event.attendees?.length || 0}</td>
                  <td>
                    <div className="event-actions">
                      <button 
                        className="action-btn view"
                        onClick={() => handleViewDetails(event._id)}
                      >
                        View
                      </button>
                      <button 
                        className="action-btn attendees"
                        onClick={() => handleViewAttendees(event._id)}
                      >
                        Attendees
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(event._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageEvents;
