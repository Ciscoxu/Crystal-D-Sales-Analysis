import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesGraphsSituation12 = ({ data, selectedMonth, selectedRegion }) => {
  const barChartRef = useRef(null);

  
  const year = data.length > 0 ? data[0].year : "Unknown Year";

  
  const salesForSelectedRegion = data
    .filter(row => row.territory === selectedRegion)
    .reduce((sum, row) => sum + (row[selectedMonth.toLowerCase()] || 0), 0);

  const barChartData = {
    labels: [`Sales in ${selectedMonth} ${year}`],
    datasets: [{
      label: `${selectedRegion} Sales`,
      backgroundColor: '#FF5733',  
      data: [salesForSelectedRegion]  
    }]
  };

  const exportChart = (format = 'png') => {
    const chart = barChartRef.current;
    if (chart) {
      const chartUrl = chart.toBase64Image(`image/${format}`);

      
      const link = document.createElement('a');
      link.href = chartUrl;
      link.download = `sales_${selectedRegion}_${selectedMonth}_${year}.${format}`;
      link.click();
    }
  };

  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportChart('png')}>Export Chart as PNG</button>
        <button onClick={() => exportChart('jpg')}>Export Chart as JPG</button>
      </div>

      
      <h3>{`${selectedRegion} Sales in ${selectedMonth} ${year}`}</h3>
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
                text: `${selectedRegion} Sales in ${selectedMonth} ${year}`
              },
              legend: {
                display: false  
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
          height={300}
        />
      </div>
    </div>
  );
};

export default SalesGraphsSituation12;

