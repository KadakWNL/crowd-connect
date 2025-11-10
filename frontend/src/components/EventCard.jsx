import { Link } from 'react-router-dom';
import '../styles/EventCard.css';

function EventCard({ event }) {
  return (
    <div className="event-card">
      <div className="event-card-header">
        <h3>{event.title}</h3>
        <span className="event-category">{event.category}</span>
      </div>
      <div className="event-card-body">
        <p className="event-date">
          <strong>Date:</strong>{' '}
            {new Date(event.date).toLocaleDateString('en-GB').replace(/\//g, '-')} at {event.time}

        </p>
        <p className="event-location">
          <strong>Location:</strong> {event.locationName}
        </p>
        <p className="event-description">{event.description.substring(0, 100)}...</p>
      </div>
      <div className="event-card-footer">
        <Link to={`/events/${event._id}`} className="view-details-btn">View Details</Link>
      </div>
    </div>
  );
}

export default EventCard;
