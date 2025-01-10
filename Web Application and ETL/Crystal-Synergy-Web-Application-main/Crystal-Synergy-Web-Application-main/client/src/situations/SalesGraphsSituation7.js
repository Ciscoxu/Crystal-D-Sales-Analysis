import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesGraphsSituation7 = ({ data, selectedMonth }) => {
  const barChartRef = useRef(null);


  const years = [...new Set(data.map(row => row.year))];
  const regions = [...new Set(data.map(row => row.territory))];

 
  const monthlySalesByYear = years.map(year => {
    
    const yearData = data.filter(row => row.year === year);
    
    // Calculate sales for each region within that year and month
    const regionSales = regions.map(region => {
      const regionData = yearData.filter(row => row.territory === region);
      const monthSales = regionData.reduce((sum, row) => sum + (row[selectedMonth.toLowerCase()] || 0), 0);
      return monthSales; // Sum of sales for that region in the selected month and year
    });

    return regionSales; // Sales by region for that year in the selected month
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
      backgroundColor: regionColors[region] || `rgba(${index * 50}, ${index * 100}, ${index * 150}, 0.5)`, 
      data: monthlySalesByYear.map(sales => sales[index]) 
    }))
  };

  const exportChart = (format = 'png') => {
    const chart = barChartRef.current;

    if (chart) {
      const chartUrl = chart.toBase64Image(`image/${format}`);

      
      const link = document.createElement('a');
      link.href = chartUrl;
      link.download = `bar_chart_${selectedMonth}.${format}`;
      link.click();
    }
  };

  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportChart('png')}>Export Chart as PNG</button>
        <button onClick={() => exportChart('jpg')}>Export Chart as JPG</button>
      </div>
      <h3>Monthly Sales for {selectedMonth} by Year (2018-2024) with Regional Contributions</h3>
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
                text: `Monthly Sales in ${selectedMonth} by Year (2018-2024)`
              },
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    label += context.raw.toLocaleString(); 
                    return label;
                  }
                }
              }
            },
            scales: {
              x: {
                stacked: true, 
              },
              y: {
                stacked: true, 
                beginAtZero: true, 
              }
            }
          }}
          height={400} 
        />
      </div>
    </div>
  );
};

export default SalesGraphsSituation7;
