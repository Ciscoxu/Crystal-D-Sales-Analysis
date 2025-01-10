import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

const SalesGraphsSituation3 = ({ data, selectedMonth }) => {
  const barChartRef = useRef(null);

  
  const filteredData = data.filter(row => row[selectedMonth.toLowerCase()] !== undefined && row[selectedMonth.toLowerCase()] !== null);

  
  const years = [...new Set(filteredData.map(row => row.year))];  
  const regions = [...new Set(filteredData.map(row => row.territory))];  


  const salesByYearAndRegion = years.map(year => {
    const yearData = filteredData.filter(row => row.year === year);
    const regionSales = regions.map(region => {
      const regionData = yearData.filter(row => row.territory === region);
      return regionData.reduce((sum, row) => sum + (row[selectedMonth.toLowerCase()] || 0), 0);  
    });
    return {
      year,
      regionSales
    };
  });


  const barChartData = {
    labels: years,
    datasets: regions.map((region, index) => ({
      label: region,
      backgroundColor: regionColors[region] || '#999999',
      data: salesByYearAndRegion.map(yearData => yearData.regionSales[regions.indexOf(region)])
    }))
  };

  const exportChart = (format = 'png') => {
    const barChart = barChartRef.current;

    if (barChart) {
      const chartUrl = barChart.toBase64Image(`image/${format}`);


      const link = document.createElement('a');
      link.href = chartUrl;
      link.download = `monthly_sales_chart.${format}`;
      link.click();
    }
  };

  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportChart('png')}>Export Chart as PNG</button>
        <button onClick={() => exportChart('jpg')}>Export Chart as JPG</button>
      </div>
      <h3>Monthly Sales ({selectedMonth}) by Year and Region</h3>
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
                text: `Monthly Sales (${selectedMonth}) by Year and Region`
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
          height={400}  
        />
      </div>
    </div>
  );
};

export default SalesGraphsSituation3;
