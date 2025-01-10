import React, { useRef } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const SalesGraphsSituation1 = ({ data }) => {
  const barChartRef = useRef(null); 
  const lineChartRef = useRef(null); 

  // Preprocess data for the bar char
  const years = [...new Set(data.map(row => row.year))]; // years
  const regions = [...new Set(data.map(row => row.territory))]; // regions

  // Process data to group by year and region
  const salesByYearAndRegion = years.map(year => {
    const yearData = data.filter(row => row.year === year);
    const regionSales = regions.map(region => {
      const regionData = yearData.filter(row => row.territory === region);
      return regionData.reduce((sum, row) => sum + (row.annual_sales || 0), 0);
    });
    return {
      year,
      regionSales
    };
  });

  // Region colors
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

  // Bar Chart data
  const barChartData = {
    labels: years,
    datasets: regions.map((region) => ({
      label: region,
      backgroundColor: regionColors[region] || `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
      data: salesByYearAndRegion.map(yearData => yearData.regionSales[regions.indexOf(region)])
    }))
  };

  // Line Chart data
  const lineChartData = {
    labels: years,  
    datasets: [
      {
        label: 'Q1 Sales',
        borderColor: '#FF5733', 
        fill: false,
        data: years.map(year => {
          const yearData = data.filter(row => row.year === year);
          return yearData.reduce((acc, row) => acc + (parseFloat(row.q1_sales) || 0), 0);  
        })
      },
      {
        label: 'Q2 Sales',
        borderColor: '#33FF57',  
        fill: false,
        data: years.map(year => {
          const yearData = data.filter(row => row.year === year);
          return yearData.reduce((acc, row) => acc + (parseFloat(row.q2_sales) || 0), 0);  
        })
      },
      {
        label: 'Q3 Sales',
        borderColor: '#3357FF',  
        fill: false,
        data: years.map(year => {
          const yearData = data.filter(row => row.year === year);
          return yearData.reduce((acc, row) => acc + (parseFloat(row.q3_sales) || 0), 0);  
        })
      },
      {
        label: 'Q4 Sales',
        borderColor: '#FFC300',  
        fill: false,
        data: years.map(year => {
          const yearData = data.filter(row => row.year === year);
          return yearData.reduce((acc, row) => acc + (parseFloat(row.q4_sales) || 0), 0);  
        })
      }
    ]
  };

  // Graph Export
  const exportBothCharts = (format = 'png') => {
    const barChart = barChartRef.current;
    const lineChart = lineChartRef.current;

    if (barChart && lineChart) {
      const barChartUrl = barChart.toBase64Image(`image/${format}`);
      const lineChartUrl = lineChart.toBase64Image(`image/${format}`);

      // Download both charts
      const barLink = document.createElement('a');
      barLink.href = barChartUrl;
      barLink.download = `bar_chart.${format}`;
      barLink.click();

      const lineLink = document.createElement('a');
      lineLink.href = lineChartUrl;
      lineLink.download = `line_chart.${format}`;
      lineLink.click();
    }
  };

  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportBothCharts('png')}>Export Graphs as PNG</button>
        <button onClick={() => exportBothCharts('jpg')}>Export Graphs as JPG</button>
      </div>
      <h3>Total Sales by Year (with Region Contribution)</h3>
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
                text: 'Total Sales by Year (2018-2024)'
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
           height={200}  
        />
      </div>

      <h3>Quarterly Sales Fluctuations (by Year)</h3>
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
                text: 'Quarterly Sales Fluctuations by Year'
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
           height={200}  
        />
      </div>
    </div>
  );
};

export default SalesGraphsSituation1;

