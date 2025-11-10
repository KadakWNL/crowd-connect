import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import '../styles/Navbar.css';
import logo from '../assets/crowdconnect.svg'

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="crowdconnectlogo" />
        </Link>
        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          {user ? (
            <>
              {user.isHost && <li><Link to="/create-event">Create Event</Link></li>}
              {user.isHost && <li><Link to="/manage-events">Manage Events</Link></li>}
              <li><Link to="/become-host">Host Settings</Link></li>
              <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
              <li className="user-greeting">Hello, {user.username}!</li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
