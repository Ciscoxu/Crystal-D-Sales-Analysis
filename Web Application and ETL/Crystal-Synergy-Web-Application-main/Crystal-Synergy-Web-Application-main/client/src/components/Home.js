import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Crystal D Market Analysis by Crystal Synergy</h1>
      <p>
        The web application is designed to present the market analyses conducted by Team Synergy from September 2024 to December 2024. The goal of this application is to provide market insights for Crystal D, our sponsor.
      </p>
    
  {/* Display Grid for the four features */}
      <div className="feature-grid">
      <Link to="/sales-summary" className="feature-box">
          <h3>Sales Summary</h3>
          <p>Provides detailed insights into sales data and trends over specific time periods.</p>
        </Link>
        <Link to="/event-summary" className="feature-box">
          <h3>Event Summary</h3>
          <p>Analyzes marketing events and their effectiveness in driving sales and engagement.</p>
        </Link>
        <Link to="/account-engagement" className="feature-box">
          <h3>Account Engagement</h3>
          <p>Tracks client interactions and retention rates to understand engagement levels.</p>
        </Link>
        <Link to="/event-influence" className="feature-box">
          <h3>Event Influence</h3>
          <p>Measures the impact of attended events on sales and customer behavior.</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;