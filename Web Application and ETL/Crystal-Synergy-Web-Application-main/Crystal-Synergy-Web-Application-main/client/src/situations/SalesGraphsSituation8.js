import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesGraphsSituation8 = ({ data, selectedMonth, selectedRegion }) => {
  const barChartRef = useRef(null);

  const years = [...new Set(data.map(row => row.year))]; 

 
  const monthlySalesByYear = years.map(year => {
    const yearData = data.filter(row => row.year === year && row.territory === selectedRegion);
    
    
    const monthSales = yearData.reduce((sum, row) => sum + (row[selectedMonth.toLowerCase()] || 0), 0);
    
    return monthSales; 
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

  const barChartData = {
    labels: years,
    datasets: [{
      label: "",
      backgroundColor: years.map(year => yearColors[year]), 
      data: monthlySalesByYear 
    }]
  };

  const exportChart = (format = 'png') => {
    const chart = barChartRef.current;

    if (chart) {
      const chartUrl = chart.toBase64Image(`image/${format}`);

     
      const link = document.createElement('a');
      link.href = chartUrl;
      link.download = `bar_chart_${selectedMonth}_${selectedRegion}.${format}`;
      link.click();
    }
  };

  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportChart('png')}>Export Chart as PNG</button>
        <button onClick={() => exportChart('jpg')}>Export Chart as JPG</button>
      </div>
      <h3>{selectedMonth} Sales across Years for {selectedRegion}</h3>
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
                text: `${selectedMonth} Sales across Years for ${selectedRegion}`
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

export default SalesGraphsSituation8;
