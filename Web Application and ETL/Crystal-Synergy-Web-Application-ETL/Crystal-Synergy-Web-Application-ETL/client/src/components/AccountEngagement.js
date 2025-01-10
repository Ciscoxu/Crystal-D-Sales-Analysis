import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './AccountEngagement.css';
import PurchaseRateGraph1 from '../accountengagementsituations/PurchaseRateGraph1';
import PurchaseRateGraph2 from '../accountengagementsituations/PurchaseRateGraph2';
import PurchaseRateGraph3 from '../accountengagementsituations/PurchaseRateGraph3';
import PurchaseRateGraph4 from '../accountengagementsituations/PurchaseRateGraph4';

const AccountEngagement = () => {
  const [year, setYear] = useState('All');
  const [month, setMonth] = useState('All');
  const [region, setRegion] = useState('All');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState('Table1');
  const [tableData, setTableData] = useState([]);
  const [graphLoaded, setGraphLoaded] = useState(false);

  const yearOptions = ['All', '2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023', '2023-2024'];
  const monthOptions = ['All', 'Jan-Feb', 'Feb-Mar', 'Mar-Apr', 'Apr-May', 'May-Jun', 'Jun-Jul', 'Jul-Aug', 'Aug-Sep', 'Sep-Oct', 'Oct-Nov', 'Nov-Dec'];
  const regionOptions = ['All', 'West', 'Midwest', 'Central', 'Northeast', 'South', 'Special', 'International'];

  const tableOptions = [
    { value: 'Table1', label: 'Purchase Rate Year-to-Year Overview' },
    { value: 'Table2', label: 'Purchase Rate Year-to-Year by Region Overview' },
    { value: 'Table3', label: 'Purchase Rate Month-to-Month by Year' },
    { value: 'Table4', label: 'Purchase Rate Month-to-Month by Year and Region' }
  ];

  const determineScenario = () => {
    if (year === 'All' && month === 'All' && region === 'All') return 1;
    if (year !== 'All' && month === 'All' && region === 'All') return 1;
    if (year === 'All' && month !== 'All' && region === 'All') return 3;
    if (year !== 'All' && month !== 'All' && region === 'All') return 3;
    if (year === 'All' && month === 'All' && region !== 'All') return 2;
    if (year !== 'All' && month === 'All' && region !== 'All') return 2;
    if (year === 'All' && month !== 'All' && region !== 'All') return 4;
    if (year !== 'All' && month !== 'All' && region !== 'All') return 4;
    return null; 
  };

  const handleSearch = async () => {
    setLoading(true);
    const scenario = determineScenario();
    try {
      const response = await axios.post('http://localhost:5000/get-account-engagement-data', {
        year,
        month,
        region,
        scenario,
      });
      console.log("Received data:", response.data);

      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleExport = () => {
    if (data.length === 0) {
      alert("No data available to export. Please perform a search first.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");

    XLSX.writeFile(workbook, "filtered_data.xlsx");
  };

  const handleTableSearch = async () => {
    setLoading(true);
    setGraphLoaded(false);
    try {
      const response = await axios.post('http://localhost:5000/get-full-table', {
        table: selectedTable
      });
      console.log("Received table data:", response.data);
      setTableData(response.data);
      setGraphLoaded(true);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
    setLoading(false);
  };

  const handleTableExport = () => {
    if (tableData.length === 0) {
      alert("No table data available to export. Please perform a search first.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table Data");
    XLSX.writeFile(workbook, "table_data.xlsx");
  };


  return (
    <div className="account-engagement-container">
      <h1>Account Engagement</h1>
      <div className="filter-section">
        <label>Year:</label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {yearOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <label>Month:</label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {monthOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <label>Region:</label>
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          {regionOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <button onClick={handleSearch}>Search</button>
      </div>

      
      {data.length > 0 && (
        <div className="preview-header">
          <div className="preview-label">
            <h3>Account Engagement Preview</h3>
          </div>
          <div className="export-button-section">
            <button type="button" onClick={handleExport}>Export to Excel</button>
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}
      <div className="data-preview">
        <table>
          <thead>
            <tr>
              {data.length > 0 && Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan="5">No data available. Please perform a search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* New Table Preview Section */}
      <div className="table-filter-section">
        <label>Select Purchase Rate Overview Type:</label>
        <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
          {tableOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <button onClick={handleTableSearch}>Search</button>
      </div>

      {tableData.length > 0 && (
        <div className="preview-header">
          <div className="preview-label">
            <h3>Purchase Rate Overview</h3>
          </div>
          <div className="export-button-section">
            <button type="button" onClick={handleTableExport}>Export to Excel</button>
          </div>
        </div>
      )}

      <div className="data-preview">
        <table>
          <thead>
            <tr>
              {tableData.length > 0 && Object.keys(tableData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? tableData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan="5">No table data available. Please perform a search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Graph Render Section */}
    {graphLoaded && tableData.length > 0 && (
      <div className="graphs-container">
        {selectedTable === 'Table1' && <PurchaseRateGraph1 data={tableData} />}
        {selectedTable === 'Table2' && <PurchaseRateGraph2 data={tableData} />}
        {selectedTable === 'Table3' && <PurchaseRateGraph3 data={tableData} />}
        {selectedTable === 'Table4' && <PurchaseRateGraph4 data={tableData} />}
      </div>
    )}
    </div>
  );
};

export default AccountEngagement;
