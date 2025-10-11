import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './About.css';

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="about-container">
        <header className="about-header">
          <h1>About Helpora</h1>
          <p>Connecting those in need with those who can help.</p>
        </header>

        <section className="about-mission">
          <h2>Our Mission</h2>
          <p>
            At Helpora, our mission is to bridge the gap between disaster victims and the resources they urgently need. We believe that in times of crisis, a rapid and efficient response can make all the difference. Our platform is designed to facilitate this connection, ensuring that aid is delivered to the right people, at the right time.
          </p>
        </section>

        <section className="about-team">
          <h2>Our Team</h2>
          <div className="team-members">
            <div className="team-member">
              <img src="https://via.placeholder.com/150" alt="Team Member 1" />
              <h3>Jane Doe</h3>
              <p>Co-Founder & CEO</p>
            </div>
            <div className="team-member">
              <img src="https://via.placeholder.com/150" alt="Team Member 2" />
              <h3>John Smith</h3>
              <p>Co-Founder & CTO</p>
            </div>
            <div className="team-member">
              <img src="https://via.placeholder.com/150" alt="Team Member 3" />
              <h3>Peter Jones</h3>
              <p>Lead Developer</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default About;
