import React from 'react';
import '../styles/About.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-card">
        <h2 className="about-title">About <span className="logo-text">crowd<span className="logo-accent">connect</span></span></h2>
        <p className="about-subtitle">Connecting People, Creating Experiences.</p>
        
        <div className="about-content">
          <p>
            Welcome to <strong>crowdconnect</strong>, the ultimate platform for discovering and hosting local events. Our mission is to bridge the gap between event organizers and attendees, making it easier than ever to find, create, and share memorable experiences.
          </p>
          <p>
            Whether you're looking for a weekend concert, a tech meetup, a community workshop, or a local market, crowdconnect is your guide to what's happening around you. For hosts, we provide simple yet powerful tools to manage your events, track attendance, and engage with your audience.
          </p>
          
          <h3 className="about-section-title">Our Vision</h3>
          <p>
            We believe in the power of community. In a world that's increasingly digital, we aim to foster real-world connections by bringing people together through shared interests and passions. Every event is an opportunity to learn, grow, and connect.
          </p>

          <h3 className="about-section-title">Join Us</h3>
          <p>
            Become a part of our growing community today. Attend an event, host your own, and start creating connections that last a lifetime.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
