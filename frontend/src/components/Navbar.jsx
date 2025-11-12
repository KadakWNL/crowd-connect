import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import '../styles/Navbar.css';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        crowd<span>connect</span>
      </Link>

      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}>Home</NavLink>
        {user?.isHost && <NavLink to="/create-event" className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}>Create Event</NavLink>}
        {user?.isHost && <NavLink to="/manage-events" className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}>Manage Events</NavLink>}
        {user && <NavLink to="/become-host" className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}>Host Settings</NavLink>}
      </div>

      {user ? (
        <div className="navbar-user">
          <span className="navbar-username">Hello, {user.username}</span>
          <button onClick={handleLogout} className="navbar-logout-btn">Logout</button>
        </div>
      ) : (
        <div className="navbar-auth-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
