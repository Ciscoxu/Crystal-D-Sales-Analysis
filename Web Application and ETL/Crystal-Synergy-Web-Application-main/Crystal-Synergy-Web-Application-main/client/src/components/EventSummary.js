import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './EventSummary.css';

const EventSummary = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [eventCounts, setEventCounts] = useState({});
  const [searchFilter, setSearchFilter] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fetch event data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-events');
        setEvents(response.data);
        setFilteredEvents(response.data); 
        calculateEventCounts(response.data); // Trigger calculate initial event counts
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents(); 
  }, []);

  // Calculate event counts for each year
  const calculateEventCounts = (data) => {
    const counts = {};
    data.forEach((event) => {
      Object.keys(event).forEach((year) => {
        if (year.match(/^\d{4}$/) &&event[year]) { // Check if the key is a valid year and has data
          counts[year] = (counts[year] || 0) + 1;
        } 
      });
    });
    setEventCounts(counts);
  };

  // Handle year selection change
  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);

    if (year === 'All') {
      setFilteredEvents(events); // Display all events if 'All' is selected
    } else {
      // Filter the data to only include the selected year and display it
      const filtered = events.filter((event) => event[year] && event[year] !== 'NaN'); 
      setFilteredEvents(filtered);
    }
  };

  useEffect(() => {
    const results = [];
    events.forEach(event => {
        Object.entries(event).forEach(([key, value]) => {
            if (key.match(/^\d{4}$/) && value && value.includes(searchFilter) && value !== 'NaN') {
                results.push({ year: key, detail: value });
            }
        });
    });
    setSearchResults(results);
}, [events, searchFilter]);

  // Export filtered data to Excel file
  const handleExport = () => {
    if (filteredEvents.length === 0) {
      alert("No data available to export.");
      return;
    }

    //Convert the filtered events to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(filteredEvents);

    //Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Events");

  
    XLSX.writeFile(workbook, "filtered_events.xlsx");
  };

  return (
    <div className="event-summary-container">
      <h1>Event Summary</h1>
  
      {/* Dropdown for year selection */}
      <div className="filter-section" style={{ justifyContent: 'center' }}>
        <label htmlFor="year">Filter by Year:</label>
        <select id="year" value={selectedYear} onChange={handleYearChange}>
          <option value="All">All</option>
          {Object.keys(eventCounts).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <label htmlFor="searchFilter" style={{ marginLeft: '20px' }}>Search Events:</label>
        <input
          id="searchFilter"
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Search for events"
          className="search-input"
        />
      </div>
  
      {/* Data preview and export */}
      <div className="preview-header">
        <div className="preview-label">
          <h3>Event Data Preview</h3>
        </div>
        <div className="export-button-section">
          <button type="button" onClick={handleExport}>Export to Excel</button>
        </div>
      </div>
  
      {/* Display filtered events */}
      <div className="data-preview">
        {filteredEvents.length > 0 ? (
          <table>
            <thead>
              <tr>
                {selectedYear !== 'All' ? (
                  <th>{selectedYear}</th>
                ) : (
                  Object.keys(events[0] || {}).map((year) => (
                    <th key={year}>{year}</th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event, index) => (
                <tr key={index}>
                  {selectedYear !== 'All' ? (
                    <td>{event[selectedYear]}</td>
                  ) : (
                    Object.keys(event).map((year) => (
                      <td key={year}>{event[year]}</td>
                    ))
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No events found for the selected year.</p>
        )}
      </div>

      <div className="results-summary-container">
      <div className="search-results">
  <h3>Search Results</h3>
  {searchResults.length > 0 ? (
    <table className="table-style">
      <thead>
        <tr>
          <th>Year</th>
          <th>Event Details</th>
        </tr>
      </thead>
      <tbody>
        {searchResults.map((result, index) => (
          <tr key={index}>
            <td>{result.year}</td>
            <td>{result.detail}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No matching events found.</p>
  )}
</div>

  <div className="summary-preview">
    <h3>Event Count Summary</h3>
    <table>
      <thead>
        <tr>
          {Object.keys(eventCounts).map((year) => (
            <th key={year}>{year}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.keys(eventCounts).map((year) => (
          <td key={year}>{eventCounts[year]}</td>
        ))}
      </tbody>
    </table>
  </div>
</div>
    </div>
  );
};

export default EventSummary;