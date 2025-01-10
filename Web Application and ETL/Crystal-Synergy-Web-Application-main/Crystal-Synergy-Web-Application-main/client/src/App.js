import { BrowserRouter as Router, Route, Routes, Switch, Link } from 'react-router-dom';
import Home from './components/Home';
import SalesSummary from './components/SalesSummary';
import EventSummary from './components/EventSummary';
import AccountEngagement from './components/AccountEngagement';
import EventInfluence from './components/EventInfluence';
import './App.css';


/* To create a new page directory, you need to first create the router and the link for navigation */
function App() {
  return (
    <Router>
    <div className="App">
        <nav className="navbar">
          <div className="logo">
            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Crystal Synergy" />
          </div>
          <ul className="navbar-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/sales-summary">Sales Summary</Link>
            </li>
            <li>
              <Link to="/event-summary">Event Summary</Link>
            </li>
            <li>
              <Link to="/account-engagement">Account Engagement</Link>
            </li>
            <li>
              <Link to="/event-influence">Event Influence</Link>
            </li>
          </ul>
        </nav>

{/* you also need to create routes for the webpage */}
      <Routes>
          <Route path="/" element={<Home />} />  {/* Home page */}
          <Route path="/sales-summary" element={<SalesSummary />} />  {/* SalesSummary page */}
          <Route path="/event-summary" element={<EventSummary />} />  {/* EventSummary page */}
          <Route path="/account-engagement" element={<AccountEngagement />} />  {/* AccountEngagement page */}
          <Route path="/event-influence" element={<EventInfluence />} />  {/* EventInfluence page */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />  {/* 404 page for unmatched routes */}
        </Routes>
    </div>
  </Router>
  );
}







export default App;
