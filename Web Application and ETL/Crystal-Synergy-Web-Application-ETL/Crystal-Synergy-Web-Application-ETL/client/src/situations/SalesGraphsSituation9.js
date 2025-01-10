import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesGraphsSituation9 = ({ data }) => {
  const quarterlyBarChartRef = useRef(null);
  const monthlyBarChartRef = useRef(null);

  const regions = [...new Set(data.map(row => row.territory))]; 
  const quarters = ['q1_sales', 'q2_sales', 'q3_sales', 'q4_sales']; 
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']; 
  
  
  const yearFromData = [...new Set(data.map(row => row.year))][0]; 

  
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


  const quarterlySalesByRegion = quarters.map(quarter => {
    return regions.map(region => {
      const regionData = data.filter(row => row.year === yearFromData && row.territory === region);
      return regionData.reduce((sum, row) => sum + (row[quarter] || 0), 0);
    });
  });

  const quarterlyBarChartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: regions.map((region, index) => ({
      label: region,
      backgroundColor: regionColors[region],
      data: quarterlySalesByRegion.map(sales => sales[index]) 
    }))
  };


  const monthlySalesByRegion = months.map(month => {
    return regions.map(region => {
      const regionData = data.filter(row => row.year === yearFromData && row.territory === region);
      return regionData.reduce((sum, row) => sum + (row[month] || 0), 0);
    });
  });

  const monthlyBarChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: regions.map((region, index) => ({
      label: region,
      backgroundColor: regionColors[region],
      data: monthlySalesByRegion.map(sales => sales[index]) 
    }))
  };

  const exportBothCharts = (format = 'png') => {
    const quarterlyChart = quarterlyBarChartRef.current;
    const monthlyChart = monthlyBarChartRef.current;

    if (quarterlyChart && monthlyChart) {
      const quarterlyChartUrl = quarterlyChart.toBase64Image(`image/${format}`);
      const monthlyChartUrl = monthlyChart.toBase64Image(`image/${format}`);

      
      const quarterlyLink = document.createElement('a');
      quarterlyLink.href = quarterlyChartUrl;
      quarterlyLink.download = `quarterly_sales_${yearFromData}.${format}`;
      quarterlyLink.click();

      
      const monthlyLink = document.createElement('a');
      monthlyLink.href = monthlyChartUrl;
      monthlyLink.download = `monthly_sales_${yearFromData}.${format}`;
      monthlyLink.click();
    }
  };


  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportBothCharts('png')}>Export Charts as PNG</button>
        <button onClick={() => exportBothCharts('jpg')}>Export Charts as JPG</button>
      </div>

      {/* First Bar Chart: Quarterly Sales by Region */}
      <h3>{`Quarterly Sales for ${yearFromData} (by Region)`}</h3>
      <div style={{ width: '100%' }}>
        <Bar 
          ref={quarterlyBarChartRef}
          data={quarterlyBarChartData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `Quarterly Sales for ${yearFromData}`
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

      {/* Second Bar Chart: Monthly Sales by Region */}
      <h3>{`Monthly Sales for ${yearFromData} (by Region)`}</h3>
      <div style={{ width: '100%' }}>
        <Bar 
          ref={monthlyBarChartRef}
          data={monthlyBarChartData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `Monthly Sales for ${yearFromData}`
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

export default SalesGraphsSituation9;


