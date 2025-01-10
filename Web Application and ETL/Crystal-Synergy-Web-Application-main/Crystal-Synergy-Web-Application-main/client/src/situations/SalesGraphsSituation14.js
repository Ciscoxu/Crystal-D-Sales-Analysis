import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesGraphsSituation14 = ({ data, selectedQuarter, selectedRegion }) => {
  const barChartRef = useRef(null);

  
  const year = data.length > 0 ? data[0].year : "Unknown Year";

  // Define months for each quarter
  const quarterMonths = {
    Q1: ['Jan', 'Feb', 'Mar'],
    Q2: ['Apr', 'May', 'Jun'],
    Q3: ['Jul', 'Aug', 'Sep'],
    Q4: ['Oct', 'Nov', 'Dec']
  };

  const months = quarterMonths[selectedQuarter]; // Get months for the selected quarter
  
  // Colors for months
  const monthColors = {
    Jan: '#FF5733',  // Red
    Feb: '#33FF57',  // Green
    Mar: '#3357FF',  // Blue
    Apr: '#FF33F6',  // Pink
    May: '#33FFF6',  // Cyan
    Jun: '#FFC300',  // Yellow
    Jul: '#C70039',  // Dark Red
    Aug: '#DAF7A6',  // Light Green
    Sep: '#900C3F',  // Dark Purple
    Oct: '#581845',  // Dark Maroon
    Nov: '#FF5733',  // Dark Red
    Dec: '#4F4F4F'   // Dark Grey
  };

  
  const salesByMonth = months.map(month => {
    const regionData = data.filter(row => row.territory === selectedRegion);
    return regionData.reduce((sum, row) => sum + (row[month.toLowerCase()] || 0), 0);
  });

  const barChartData = {
    labels: months,
    datasets: [{
      label: `Monthly Sales for ${selectedQuarter} ${year} (${selectedRegion})`,
      backgroundColor: months.map(month => monthColors[month]),
      data: salesByMonth
    }]
  };

  const exportChart = (format = 'png') => {
    const chart = barChartRef.current;
    if (chart) {
      const chartUrl = chart.toBase64Image(`image/${format}`);

      
      const link = document.createElement('a');
      link.href = chartUrl;
      link.download = `sales_${selectedQuarter}_${year}_${selectedRegion}.${format}`;
      link.click();
    }
  };

  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportChart('png')}>Export Chart as PNG</button>
        <button onClick={() => exportChart('jpg')}>Export Chart as JPG</button>
      </div>

      
      <h3>Monthly Sales for {selectedQuarter} {year} ({selectedRegion})</h3>
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
                text: `Monthly Sales for ${selectedQuarter} ${year} (${selectedRegion})`
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

export default SalesGraphsSituation14;
