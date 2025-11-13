import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { createEvent } from '../services/api';
import '../styles/CreateEvent.css';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

function CreateEvent({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    category: 'Music',
    locationName: ''
  });
  const [position, setPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]); // Default to Bengaluru
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setMapCenter([userLocation.lat, userLocation.lng]);
          setPosition(userLocation);
        },
        (err) => {
          console.log('Could not get location, using default');
        }
      );
    }
  }, []);

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(userLocation);
          setMapCenter([userLocation.lat, userLocation.lng]);
        },
        (err) => {
          setError('Could not get your location. Please click on the map instead.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!position) {
      setError('Please select a location on the map or use your current location');
      return;
    }

    if (!user || !user.isHost) {
      setError('You must be a host to create events');
      return;
    }

    setLoading(true);

    try {
      await createEvent({
        ...formData,
        latitude: position.lat,
        longitude: position.lng
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!user) {
    return (
      <div className="create-event-container">
        <p>Please log in to create events.</p>
      </div>
    );
  }

  if (!user.isHost) {
    return (
      <div className="create-event-container">
        <h2>Become a Host First</h2>
        <p>You need to become a host before you can create events.</p>
        <button onClick={() => navigate('/become-host')} className="submit-btn">
          Become a Host
        </button>
      </div>
    );
  }

  return (
    <div className="create-event-container">
      <h2>Create New Event</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time *</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Music">Music</option>
            <option value="Sports">Sports</option>
            <option value="Technology">Technology</option>
            <option value="Food">Food</option>
            <option value="Art">Art</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="locationName">Location Name *</label>
          <input
            type="text"
            id="locationName"
            name="locationName"
            value={formData.locationName}
            onChange={handleChange}
            placeholder="e.g., Central Park, Times Square"
            required
          />
        </div>

        <div className="form-group">
          <label>Select Location on Map *</label>
          <button type="button" onClick={handleUseMyLocation} className="location-btn">
            Use My Current Location
          </button>
          {position && (
            <p className="location-info">
              Selected: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </p>
          )}
          <div className="map-wrapper">
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '400px', width: '100%' }}
              key={`${mapCenter[0]}-${mapCenter[1]}`}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
          <p className="map-hint">Click on the map to drop a pin at your event location</p>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
