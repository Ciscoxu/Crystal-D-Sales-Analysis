import React, { useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const SalesGraphsSituation5 = ({ data, selectedQuarter }) => {
  const lineChartRef = useRef(null); 
  const barChartRef = useRef(null);

  // Define months for each quarter
  const quarterMonths = {
    Q1: ['Jan', 'Feb', 'Mar'],
    Q2: ['Apr', 'May', 'Jun'],
    Q3: ['Jul', 'Aug', 'Sep'],
    Q4: ['Oct', 'Nov', 'Dec']
  };

  const months = quarterMonths[selectedQuarter]; // Get months for the selected quarter
  const years = [...new Set(data.map(row => row.year))]; // Get years
  const regions = [...new Set(data.map(row => row.territory))]; // Get regions

  
  const monthlySalesByYear = years.map(year => {
    return months.map(month => {
      const monthSales = data
        .filter(row => row.year === year)
        .reduce((sum, row) => sum + (row[month.toLowerCase()] || 0), 0);
      return monthSales;
    });
  });

  const yearColors = {
    2018: '#FF5733',  // Red
    2019: '#33FF57',  // Green
    2020: '#3357FF',  // Blue
    2021: '#FF33F6',  // Pink
    2022: '#33FFF6',  // Cyan
    2023: '#FFC300',  // Yellow
    2024: '#C70039'   // Dark Red
  };

  const lineChartData = {
    labels: months,
    datasets: years.map((year, index) => ({
      label: `${year} Sales`,
      borderColor: yearColors[year],
      backgroundColor: yearColors[year],
      pointBackgroundColor: yearColors[year],
      fill: false,
      data: monthlySalesByYear[index]
    }))
  };

  
  const quarterlySalesByYear = years.map(year => {
    
    const yearData = data.filter(row => row.year === year);
    
    
    const totalQuarterSales = yearData.reduce((sum, row) => sum + (row[`${selectedQuarter.toLowerCase()}_sales`] || 0), 0);
    
    
    const regionSales = regions.map(region => {
      const regionData = yearData.filter(row => row.territory === region);
      const regionQuarterSales = regionData.reduce((sum, row) => sum + (row[`${selectedQuarter.toLowerCase()}_sales`] || 0), 0);
      return regionQuarterSales;
    });

    return { year, totalQuarterSales, regionSales };
  });

  const regionColors = {
    West: '#FF5733',         // Red
    Midwest: '#33FF57',      // Green
    Central: '#3357FF',      // Blue
    Northeast: '#FF33F6',    // Pink
    South: '#33FFF6',        // Cyan
    Special: '#FFC300',      // Yellow
    International: '#C70039',// Dark Red
    Unknown: '#4F4F4F'       // Dark Grey
  };

  const barChartData = {
    labels: years,
    datasets: regions.map((region, index) => ({
      label: region,
      backgroundColor: regionColors[region] || `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
      data: quarterlySalesByYear.map(yearData => yearData.regionSales[index]) // The actual sales number for the region in that quarter
    }))
  };

  const exportBothCharts = (format = 'png') => {
    const lineChart = lineChartRef.current;
    const barChart = barChartRef.current;

    if (lineChart && barChart) {
      const lineChartUrl = lineChart.toBase64Image(`image/${format}`);
      const barChartUrl = barChart.toBase64Image(`image/${format}`);

      
      const lineLink = document.createElement('a');
      lineLink.href = lineChartUrl;
      lineLink.download = `line_chart_${selectedQuarter}.${format}`;
      lineLink.click();

      
      const barLink = document.createElement('a');
      barLink.href = barChartUrl;
      barLink.download = `bar_chart_${selectedQuarter}.${format}`;
      barLink.click();
    }
  };

  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportBothCharts('png')}>Export Charts as PNG</button>
        <button onClick={() => exportBothCharts('jpg')}>Export Charts as JPG</button>
      </div>
      <h3>Monthly Sales within {selectedQuarter} (2018-2024)</h3>
      <div style={{ width: '100%' }}>
        <Line
          ref={lineChartRef} 
          data={lineChartData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `Monthly Sales within ${selectedQuarter} (2018-2024)`
              }
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
          height={300} 
        />
      </div>

      <h3>Total {selectedQuarter} Sales by Year (2018-2024) with Region Contributions</h3>
      <div style={{ width: '100%' }}>
        <Bar 
          ref={barChartRef}
          data={barChartData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `Total ${selectedQuarter} Sales by Year (2018-2024)`
              },
              legend: {
                position: 'top',
              },
            },
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
                beginAtZero: true,
              },
            },
          }}
          height={300} 
        />
      </div>
    </div>
  );
};

export default SalesGraphsSituation5;


