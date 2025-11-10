import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toggleHost } from '../services/api';
import '../styles/HostToggle.css';

function HostToggle({ user, setUser }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleToggle = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await toggleHost();
      setUser(data.user);
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update host status');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="host-toggle-container">
        <p>Please log in to access host settings.</p>
      </div>
    );
  }

  return (
    <div className="host-toggle-container">
      <div className="host-toggle-card">
        <h2>Host Settings</h2>
        
        <div className="status-section">
          <p className="current-status">
            Current Status: <strong>{user.isHost ? 'Host' : 'Regular User'}</strong>
          </p>
        </div>

        <div className="info-section">
          <h3>What is a Host?</h3>
          <p>Hosts can create and manage events on CrowdConnect. As a host, you'll be able to:</p>
          <ul>
            <li>Create new events</li>
            <li>Choose event locations on the map</li>
            <li>Manage your event details</li>
            <li>Connect with attendees</li>
          </ul>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <button onClick={handleToggle} className="toggle-btn" disabled={loading}>
          {loading ? 'Updating...' : user.isHost ? 'Stop Being a Host' : 'Become a Host'}
        </button>

        {user.isHost && (
          <button onClick={() => navigate('/create-event')} className="create-event-link">
            Create Your First Event
          </button>
        )}
      </div>
    </div>
  );
}

export default HostToggle;
