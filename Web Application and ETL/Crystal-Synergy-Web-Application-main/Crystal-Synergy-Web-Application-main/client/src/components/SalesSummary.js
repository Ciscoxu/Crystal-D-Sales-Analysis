import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './SalesSummary.css'; 
import SalesGraphsSituation1 from '../situations/SalesGraphsSituation1';
import SalesGraphsSituation2 from '../situations/SalesGraphsSituation2';
import SalesGraphsSituation3 from '../situations/SalesGraphsSituation3';
import SalesGraphsSituation4 from '../situations/SalesGraphsSituation4';
import SalesGraphsSituation5 from '../situations/SalesGraphsSituation5';
import SalesGraphsSituation6 from '../situations/SalesGraphsSituation6';
import SalesGraphsSituation7 from '../situations/SalesGraphsSituation7';
import SalesGraphsSituation8 from '../situations/SalesGraphsSituation8';
import SalesGraphsSituation9 from '../situations/SalesGraphsSituation9';
import SalesGraphsSituation10 from '../situations/SalesGraphsSituation10';
import SalesGraphsSituation11 from '../situations/SalesGraphsSituation11';
import SalesGraphsSituation12 from '../situations/SalesGraphsSituation12';
import SalesGraphsSituation13 from '../situations/SalesGraphsSituation13';
import SalesGraphsSituation14 from '../situations/SalesGraphsSituation14';
import SalesGraphsSituation15 from '../situations/SalesGraphsSituation15';
import SalesGraphsSituation16 from '../situations/SalesGraphsSituation16';


const SalesSummary = () => {
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedQuarter, setSelectedQuarter] = useState('All');
  const [availableMonths, setAvailableMonths] = useState(['All']);
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [territory, setTerritory] = useState('All');
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [columnsToDisplay, setColumnsToDisplay] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sumData, setSumData] = useState({});
  const [searchTriggered, setSearchTriggered] = useState(false);

  const quarters = {
    'Q1': ['Jan', 'Feb', 'Mar'],
    'Q2': ['Apr', 'May', 'Jun'],
    'Q3': ['Jul', 'Aug', 'Sep'],
    'Q4': ['Oct', 'Nov', 'Dec'],
  };

  /* The use effect helps handle the quarter change through the predefined quarters constant and the availablemonths state variable */
  useEffect(() => {
    if (selectedQuarter !== 'All') {
      setAvailableMonths(['All', ...quarters[selectedQuarter]]); // Set months based on the selected quarter (choose 'All' or choose a specific month in that quarter)
    } else {
      setAvailableMonths(['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']); // If 'All' is selected, allow all months to be available
    }
  }, [selectedQuarter]); // This effect runs whenever the selectedQuarter state changes

  useEffect(() => {
    setSearchTriggered(false);
  }, [selectedYear, selectedQuarter, selectedMonth, territory]);

  const handleSearch = async () => {
    setLoading(true);
    setGraphData([]);
    setSearchTriggered(false); 
    try {
      const response = await axios.post('http://localhost:5000/get-data', {
        year: selectedYear,
        quarter: selectedQuarter,
        month: selectedMonth,
        territory: territory,
      });
      setData(response.data);  // Store the received data in state
      updateColumnsToDisplay(response.data);
      setGraphData(response.data);
      setSearchTriggered(true); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const updateColumnsToDisplay = (data) => {
    if (data.length === 0) return; 
  
    const defaultColumns = ['c1accountno', 'cxrecords', 'year', 'territory', 'annual_sales'];
    const optionalColumns = ['q1_sales', 'q2_sales', 'q3_sales', 'q4_sales', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  
    //Check the first row of data to determine which optional columns to display
    const firstRow = data[0];
    const columnsWithValues = optionalColumns.filter(column => firstRow[column] !== null && firstRow[column] !== undefined);
  

    setColumnsToDisplay([...defaultColumns, ...columnsWithValues]);

    calculateSums(data, columnsWithValues);
  };

  const calculateSums = (data, columnsWithValues) => {
    let sums = {};
    columnsWithValues.forEach(col => {
      sums[col] = data.reduce((acc, row) => {

        const value = parseFloat(row[col]) || 0;
        return acc + value;
      }, 0);
    });

    sums['annual_sales'] = data.reduce((acc, row) => {
        const value = parseFloat(row['annual_sales']) || 0;
        return acc + value;
      }, 0);
    setSumData(sums);
  };

  const handleExport = () => {
    //Check if data is empty before exporting
    if (data.length === 0) {
      alert("No data available to export. Please perform a search first.");
      return; 
    }

    
    const worksheet = XLSX.utils.json_to_sheet(data);

   
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data");


    XLSX.writeFile(workbook, "exported_data.xlsx");
  };

  //Determine the Filter State to trigger the container display
  const isAllFiltersSelected = selectedYear === 'All' && selectedQuarter === 'All' && selectedMonth === 'All' && territory === 'All';
  const isTerritorySelected = selectedYear === 'All' && selectedQuarter === 'All' && selectedMonth === 'All' && territory !== 'All';
  const isMonthSelected = selectedYear === 'All' && selectedQuarter === 'All' && territory === 'All' && selectedMonth !== 'All';
  const isMonthAndRegionSelected = selectedYear === 'All' && selectedQuarter === 'All' && selectedMonth !== 'All' && territory !== 'All';
  const isQuarterSelected = selectedYear === 'All' && selectedMonth === 'All' && territory === 'All' && selectedQuarter !== 'All';
  const isQuarterAndRegionSelected = selectedYear === 'All' && selectedMonth === 'All' && selectedQuarter !== 'All' && territory !== 'All';
  const isQuarterAndMonthSelected = selectedYear === 'All' && territory === 'All' && selectedQuarter !== 'All' && selectedMonth !== 'All';
  const isQuarterMonthAndRegionSelected = selectedYear === 'All' && selectedQuarter !== 'All' && selectedMonth !== 'All' && territory !== 'All';
  const isYearSelectedOnly = selectedYear !== 'All' && selectedQuarter === 'All' && selectedMonth === 'All' && territory === 'All';
  const isYearAndRegionSelected = selectedYear !== 'All' && selectedQuarter === 'All' && selectedMonth === 'All' && territory !== 'All';
  const isQuarterAllYearMonthRegionSelected = selectedYear !== 'All' && selectedQuarter === 'All' && selectedMonth !== 'All' && territory !== 'All';
  const isYearAndMonthSelected = selectedYear !== 'All' && selectedQuarter === 'All' && selectedMonth !== 'All' && territory === 'All';
  const isYearAndQuarterSelected = selectedYear !== 'All' && selectedQuarter !== 'All' && selectedMonth === 'All' && territory === 'All';
  const isYearQuarterAndRegionSelected = selectedYear !== 'All' && selectedQuarter !== 'All' && selectedMonth === 'All' && territory !== 'All';
  const isYearQuarterMonthAllRegionsSelected = selectedYear !== 'All' && selectedQuarter !== 'All' && selectedMonth !== 'All' && territory === 'All';
  const isYearQuarterMonthRegionSelected = selectedYear !== 'All' && selectedQuarter !== 'All' && selectedMonth !== 'All' && territory !== 'All';


  return (
    <div className="sales-summary-container">
      <h1>Crystal D Sales Summary</h1>

      <div className="filter-section">
        <label htmlFor="year">Year:</label>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="All">All</option>
          {[2018, 2019, 2020, 2021, 2022, 2023, 2024].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <label htmlFor="quarter">Quarter:</label>
        <select value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)}>
          <option value="All">All</option>
          <option value="Q1">Q1</option>
          <option value="Q2">Q2</option>
          <option value="Q3">Q3</option>
          <option value="Q4">Q4</option>
        </select>

        <label htmlFor="month">Month:</label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {availableMonths.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        <label htmlFor="territory">Territory:</label>
        <select value={territory} onChange={(e) => setTerritory(e.target.value)}>
          <option value="All">All</option>
          <option value="West">West</option>
          <option value="Midwest">Midwest</option>
          <option value="Central">Central</option>
          <option value="Northeast">Northeast</option>
          <option value="South">South</option>
          <option value="Special">Special</option>
          <option value="International">International</option>
        </select>
            <div className="button-section">
                <button type="button" onClick={handleSearch}>Search</button>
            </div>
      </div>


        {data.length > 0 && (
            <div className="preview-header">
            <div className="preview-label">
                <h3>Sales Data Preview</h3>
            </div>
            <div className="export-button-section">
                <button type="button" onClick={handleExport}>Export to Excel</button>
            </div>
            </div>
        )}


      {loading && <p>Loading data...</p>}

      <div className="data-preview">
        <table>
          <thead>
            <tr>
              {columnsToDisplay.includes('c1accountno') && <th>C1AccountNumber</th>}
              {columnsToDisplay.includes('cxrecords') && <th>CXRecords</th>}
              {columnsToDisplay.includes('year') && <th>Year</th>}
              {columnsToDisplay.includes('q1_sales') && <th>Q1 Sales</th>}
              {columnsToDisplay.includes('q2_sales') && <th>Q2 Sales</th>}
              {columnsToDisplay.includes('q3_sales') && <th>Q3 Sales</th>}
              {columnsToDisplay.includes('q4_sales') && <th>Q4 Sales</th>}
              {columnsToDisplay.includes('jan') && <th>Jan</th>}
              {columnsToDisplay.includes('feb') && <th>Feb</th>}
              {columnsToDisplay.includes('mar') && <th>Mar</th>}
              {columnsToDisplay.includes('apr') && <th>Apr</th>}
              {columnsToDisplay.includes('may') && <th>May</th>}
              {columnsToDisplay.includes('jun') && <th>Jun</th>}
              {columnsToDisplay.includes('jul') && <th>Jul</th>}
              {columnsToDisplay.includes('aug') && <th>Aug</th>}
              {columnsToDisplay.includes('sep') && <th>Sep</th>}
              {columnsToDisplay.includes('oct') && <th>Oct</th>}
              {columnsToDisplay.includes('nov') && <th>Nov</th>}
              {columnsToDisplay.includes('dec') && <th>Dec</th>}
              {columnsToDisplay.includes('territory') && <th>Territory</th>}
              {columnsToDisplay.includes('annual_sales') && <th>Annual Sales</th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.slice(0,1000).map((row, index) => (
                <tr key={index}>
                  {columnsToDisplay.includes('c1accountno') && <td>{row.c1accountno}</td>}
                  {columnsToDisplay.includes('cxrecords') && <td>{row.cxrecords}</td>}
                  {columnsToDisplay.includes('year') && <td>{row.year}</td>}
                  {columnsToDisplay.includes('q1_sales') && <td>{row.q1_sales}</td>}
                  {columnsToDisplay.includes('q2_sales') && <td>{row.q2_sales}</td>}
                  {columnsToDisplay.includes('q3_sales') && <td>{row.q3_sales}</td>}
                  {columnsToDisplay.includes('q4_sales') && <td>{row.q4_sales}</td>}
                  {columnsToDisplay.includes('jan') && <td>{row.jan}</td>}
                  {columnsToDisplay.includes('feb') && <td>{row.feb}</td>}
                  {columnsToDisplay.includes('mar') && <td>{row.mar}</td>}
                  {columnsToDisplay.includes('apr') && <td>{row.apr}</td>}
                  {columnsToDisplay.includes('may') && <td>{row.may}</td>}
                  {columnsToDisplay.includes('jun') && <td>{row.jun}</td>}
                  {columnsToDisplay.includes('jul') && <td>{row.jul}</td>}
                  {columnsToDisplay.includes('aug') && <td>{row.aug}</td>}
                  {columnsToDisplay.includes('sep') && <td>{row.sep}</td>}
                  {columnsToDisplay.includes('oct') && <td>{row.oct}</td>}
                  {columnsToDisplay.includes('nov') && <td>{row.nov}</td>}
                  {columnsToDisplay.includes('dec') && <td>{row.dec}</td>}
                  {columnsToDisplay.includes('territory') && <td>{row.territory}</td>}
                  {columnsToDisplay.includes('annual_sales') && <td>{row.annual_sales}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No data available. Please perform a search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    {/* Display sum row */}
    {data.length > 0 && (
    <>
    <div className="sum-row">
        <div className="sum-label">
            <h3>Sum of Sales</h3> 
        </div>
        <table>
            <thead>
            <tr>
                {columnsToDisplay.includes('q1_sales') && <th>Q1 Sales</th>}
                {columnsToDisplay.includes('q2_sales') && <th>Q2 Sales</th>}
                {columnsToDisplay.includes('q3_sales') && <th>Q3 Sales</th>}
                {columnsToDisplay.includes('q4_sales') && <th>Q4 Sales</th>}
                {columnsToDisplay.includes('jan') && <th>Jan</th>}
                {columnsToDisplay.includes('feb') && <th>Feb</th>}
                {columnsToDisplay.includes('mar') && <th>Mar</th>}
                {columnsToDisplay.includes('apr') && <th>Apr</th>}
                {columnsToDisplay.includes('may') && <th>May</th>}
                {columnsToDisplay.includes('jun') && <th>Jun</th>}
                {columnsToDisplay.includes('jul') && <th>Jul</th>}
                {columnsToDisplay.includes('aug') && <th>Aug</th>}
                {columnsToDisplay.includes('sep') && <th>Sep</th>}
                {columnsToDisplay.includes('oct') && <th>Oct</th>}
                {columnsToDisplay.includes('nov') && <th>Nov</th>}
                {columnsToDisplay.includes('dec') && <th>Dec</th>}
                {columnsToDisplay.includes('annual_sales') && <th>Annual Sales</th>}
            </tr>
            </thead>
            <tbody>
            <tr>
                {columnsToDisplay.includes('q1_sales') && <td>{(sumData.q1_sales || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('q2_sales') && <td>{(sumData.q2_sales || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('q3_sales') && <td>{(sumData.q3_sales || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('q4_sales') && <td>{(sumData.q4_sales || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('jan') && <td>{(sumData.jan || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('feb') && <td>{(sumData.feb || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('mar') && <td>{(sumData.mar || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('apr') && <td>{(sumData.apr || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('may') && <td>{(sumData.may || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('jun') && <td>{(sumData.jun || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('jul') && <td>{(sumData.jul || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('aug') && <td>{(sumData.aug || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('sep') && <td>{(sumData.sep || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('oct') && <td>{(sumData.oct || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('nov') && <td>{(sumData.nov || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('dec') && <td>{(sumData.dec || 0).toFixed(2)}</td>}
                {columnsToDisplay.includes('annual_sales') && <td>{(sumData.annual_sales || 0).toFixed(2)}</td>}
            </tr>
            </tbody>
        </table>
        </div>
        </>
    )}
    {searchTriggered && graphData.length > 0 && (
        <div className="graphs-container">
          {isAllFiltersSelected && <SalesGraphsSituation1 data={graphData} />}
          {isTerritorySelected && <SalesGraphsSituation2 data={graphData} selectedRegion={territory} />}
          {isMonthSelected && <SalesGraphsSituation3 data={graphData} selectedMonth={selectedMonth} />}
          {isMonthAndRegionSelected && <SalesGraphsSituation4 data={graphData} selectedRegion={territory} selectedMonth={selectedMonth} />}
          {isQuarterSelected && <SalesGraphsSituation5 data={graphData} selectedQuarter={selectedQuarter} />}
          {isQuarterAndRegionSelected && <SalesGraphsSituation6 data={graphData} selectedQuarter={selectedQuarter} selectedRegion={territory} />}
          {isQuarterAndMonthSelected && <SalesGraphsSituation7 data={graphData} selectedMonth={selectedMonth} />}
          {isQuarterMonthAndRegionSelected && <SalesGraphsSituation8 data={graphData} selectedMonth={selectedMonth} selectedRegion={territory} />}
          {isYearSelectedOnly && <SalesGraphsSituation9 data={graphData} selectedYear={selectedYear} />}
          {isYearAndRegionSelected && <SalesGraphsSituation10 data={graphData} selectedRegion={territory} />}
          {isYearAndMonthSelected && <SalesGraphsSituation11 data={graphData} selectedMonth={selectedMonth} />}
          {isQuarterAllYearMonthRegionSelected && <SalesGraphsSituation12 data={graphData} selectedMonth={selectedMonth} selectedRegion={territory} />}
          {isYearAndQuarterSelected && <SalesGraphsSituation13 data={graphData} selectedYear={selectedYear} selectedQuarter={selectedQuarter} />}
          {isYearQuarterAndRegionSelected && <SalesGraphsSituation14 data={graphData} selectedQuarter={selectedQuarter} selectedRegion={territory} />}
          {isYearQuarterMonthAllRegionsSelected && <SalesGraphsSituation15 data={graphData} selectedMonth={selectedMonth} />}
          {isYearQuarterMonthRegionSelected && <SalesGraphsSituation16 data={graphData} selectedMonth={selectedMonth} selectedRegion={territory} />}
        </div>
      )}
    </div>
  );
  
};

export default SalesSummary;
