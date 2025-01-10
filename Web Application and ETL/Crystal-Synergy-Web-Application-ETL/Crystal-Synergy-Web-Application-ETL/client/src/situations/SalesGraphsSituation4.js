import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesGraphsSituation4 = ({ data, selectedRegion, selectedMonth }) => {
  const barChartRef = useRef(null);


  const filteredData = data.filter(row => row.territory === selectedRegion);


  const years = [...new Set(filteredData.map(row => row.year))]; 
  const monthlySalesByYear = years.map(year => {
    return filteredData
      .filter(row => row.year === year)
      .reduce((sum, row) => sum + (row[selectedMonth.toLowerCase()] || 0), 0); 
  });


  const barChartData = {
    labels: years,
    datasets: [{
      label: `Monthly Sales (${selectedRegion} - ${selectedMonth})`,
      backgroundColor: '#FF5733', 
      data: monthlySalesByYear
    }]
  };

  const exportChart = (format = 'png') => {
    const barChart = barChartRef.current;

    if (barChart) {
      const chartUrl = barChart.toBase64Image(`image/${format}`);


      const link = document.createElement('a');
      link.href = chartUrl;
      link.download = `monthly_sales_${selectedRegion}_${selectedMonth}_chart.${format}`;
      link.click();
    }
  };

  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportChart('png')}>Export Chart as PNG</button>
        <button onClick={() => exportChart('jpg')}>Export Chart as JPG</button>
      </div>
      <h3>Monthly Sales by Year ({selectedRegion} - {selectedMonth})</h3>
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
                text: `Monthly Sales by Year (${selectedRegion} - ${selectedMonth})`
              },
              legend: {
                position: 'top',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
          height={200} 
        />
      </div>
    </div>
  );
};

export default SalesGraphsSituation4;
