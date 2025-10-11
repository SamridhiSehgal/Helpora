import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <div className="how-it-works">
      <h2>How It Works</h2>
      <div className="steps">
        <div className="step">
          <div className="step-icon">1</div>
          <h3>Request Aid</h3>
          <p>Victims submit a request for aid through our platform.</p>
        </div>
        <div className="step">
          <div className="step-icon">2</div>
          <h3>NGOs Respond</h3>
          <p>Nearby NGOs are notified and can respond to the request.</p>
        </div>
        <div className="step">
          <div className="step-icon">3</div>
          <h3>Track Fulfillment</h3>
          <p>Victims and NGOs can track the fulfillment of the request in real-time.</p>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
