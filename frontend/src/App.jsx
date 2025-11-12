import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import HostToggle from './pages/HostToggle';
import ManageEvents from './pages/ManageEvents';
import AttendeesList from './pages/AttendeesList';
import About from './pages/About';
import UserProfile from './pages/UserProfile';
import { getCurrentUser } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<UserProfile user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/create-event" element={<CreateEvent user={user} />} />
          <Route path="/become-host" element={<HostToggle user={user} setUser={setUser} />} />
          <Route path="/manage-events" element={<ManageEvents user={user} />} />
          <Route path="/events/:id/attendees" element={<AttendeesList user={user} />} />
        </Routes>
        <footer className="footer">
          <p>&copy; 2025 CrowdConnect. Bringing communities together.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
