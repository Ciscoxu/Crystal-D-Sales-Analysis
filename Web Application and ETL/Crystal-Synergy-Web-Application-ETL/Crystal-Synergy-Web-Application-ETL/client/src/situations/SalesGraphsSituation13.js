import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesGraphsSituation13 = ({ data, selectedQuarter }) => {
  const barChartRef = useRef(null);

  
  const year = data.length > 0 ? data[0].year : "Unknown Year";

  
  const quarterMonths = {
    Q1: ['jan', 'feb', 'mar'],
    Q2: ['apr', 'may', 'jun'],
    Q3: ['jul', 'aug', 'sep'],
    Q4: ['oct', 'nov', 'dec']
  };

  const months = quarterMonths[selectedQuarter.toUpperCase()] || [];
  
  
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

  
  const salesByMonthAndRegion = months.map(month => {
    return regions.map(region => {
      const regionData = data.filter(row => row.territory === region);
      
      return regionData.reduce((sum, row) => sum + (row[month] || 0), 0);
    });
  });

  
  const barChartData = {
    labels: months.map(month => month.toUpperCase()), 
    datasets: regions.map((region, index) => ({
      label: region,
      backgroundColor: regionColors[region],
      data: salesByMonthAndRegion.map(sales => sales[index]) 
    }))
  };

  const exportChart = (format = 'png') => {
    const chart = barChartRef.current;
    if (chart) {
      const chartUrl = chart.toBase64Image(`image/${format}`);

      
      const link = document.createElement('a');
      link.href = chartUrl;
      link.download = `sales_${selectedQuarter}_${year}.${format}`;
      link.click();
    }
  };

  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportChart('png')}>Export Chart as PNG</button>
        <button onClick={() => exportChart('jpg')}>Export Chart as JPG</button>
      </div>

      
      <h3>Monthly Sales in {selectedQuarter} {year} (by Region)</h3>
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
                text: `Monthly Sales in ${selectedQuarter} ${year} (by Region)` // Use year extracted from data
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

export default SalesGraphsSituation13;
