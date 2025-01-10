import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesGraphsSituation11 = ({ data, selectedMonth }) => {
  const barChartRef = useRef(null);

  
  const year = data.length > 0 ? data[0].year : "Unknown Year";

  const regions = [...new Set(data.map(row => row.territory))]; 

 
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

  
  const salesByRegion = regions.map(region => {
    const regionData = data.filter(row => row.territory === region);
    return regionData.reduce((sum, row) => sum + (row[selectedMonth.toLowerCase()] || 0), 0);
  });

  const barChartData = {
    labels: regions,
    datasets: [{
      label: `Sales in ${selectedMonth} ${year} (by Region)`,
      backgroundColor: regions.map(region => regionColors[region] || '#000'),  
      data: salesByRegion
    }]
  };

  const exportChart = (format = 'png') => {
    const chart = barChartRef.current;
    if (chart) {
      const chartUrl = chart.toBase64Image(`image/${format}`);
      
      
      const link = document.createElement('a');
      link.href = chartUrl;
      link.download = `sales_${selectedMonth}_${year}.${format}`;
      link.click();
    }
  };


  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportChart('png')}>Export Chart as PNG</button>
        <button onClick={() => exportChart('jpg')}>Export Chart as JPG</button>
      </div>

      
      <h3>Sales in {selectedMonth} {year} (by Region)</h3>
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
                text: `Sales in ${selectedMonth} ${year} (by Region)`
              },
              legend: {
                display: false,  
              },
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
    </div>
  );
};

export default SalesGraphsSituation11;
