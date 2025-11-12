import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logout } from '../services/api';
import '../styles/Navbar.css';

function Navbar({ user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
        crowd<span>connect</span>
      </Link>

      <div className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        &#9776;
      </div>

      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <NavLink to="/" className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")} onClick={() => setMenuOpen(false)}>Home</NavLink>
        {user?.isHost && <NavLink to="/create-event" className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")} onClick={() => setMenuOpen(false)}>Create Event</NavLink>}
        {user?.isHost && <NavLink to="/manage-events" className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")} onClick={() => setMenuOpen(false)}>Manage Events</NavLink>}
        <NavLink to="/about" className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")} onClick={() => setMenuOpen(false)}>About</NavLink>
        
        <div className="navbar-user-mobile">
          {user ? (
            <>
              <NavLink to="/profile" className="navbar-link" onClick={() => setMenuOpen(false)}>My Profile</NavLink>
              <NavLink to="/become-host" className="navbar-link" onClick={() => setMenuOpen(false)}>Host Settings</NavLink>
              <button onClick={handleLogout} className="navbar-logout-btn">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="navbar-link" onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/signup" className="navbar-link" onClick={() => setMenuOpen(false)}>Sign Up</NavLink>
            </>
          )}
        </div>
      </div>

      {user ? (
        <div className="navbar-user">
          <NavLink to="/become-host" className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}>Host Settings</NavLink>
          <Link to="/profile" className="navbar-username-link">Hello, {user.username}</Link>
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
