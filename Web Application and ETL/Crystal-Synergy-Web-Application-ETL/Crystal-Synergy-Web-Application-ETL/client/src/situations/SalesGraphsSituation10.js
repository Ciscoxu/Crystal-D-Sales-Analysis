import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const SalesGraphsSituation10 = ({ data, selectedRegion }) => {
  const quarterlyLineChartRef = useRef(null);
  const monthlyLineChartRef = useRef(null);

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  
  const year = data.length > 0 ? data[0].year : "Unknown Year";

  
  const quarterlySales = quarters.map(quarter => {
    return data.reduce((sum, row) => sum + (row[`${quarter.toLowerCase()}_sales`] || 0), 0);
  });

  const quarterlyLineChartData = {
    labels: quarters,
    datasets: [{
      label: `Quarterly Sales Fluctuations for ${year} (${selectedRegion})`,
      borderColor: '#FF5733', 
      pointBackgroundColor: '#FF5733',
      fill: false,
      data: quarterlySales
    }]
  };

  
  const monthlySales = months.map(month => {
    return data.reduce((sum, row) => sum + (row[month.toLowerCase()] || 0), 0);
  });

  const monthlyLineChartData = {
    labels: months,
    datasets: [{
      label: `Monthly Sales Fluctuations for ${year} (${selectedRegion})`,
      borderColor: '#33FF57',  
      pointBackgroundColor: '#33FF57',
      fill: false,
      data: monthlySales
    }]
  };

  const exportBothCharts = (format = 'png') => {
    const quarterlyChart = quarterlyLineChartRef.current;
    const monthlyChart = monthlyLineChartRef.current;

    if (quarterlyChart && monthlyChart) {
      const quarterlyChartUrl = quarterlyChart.toBase64Image(`image/${format}`);
      const monthlyChartUrl = monthlyChart.toBase64Image(`image/${format}`);

      
      const quarterlyLink = document.createElement('a');
      quarterlyLink.href = quarterlyChartUrl;
      quarterlyLink.download = `quarterly_sales_${year}.${format}`;
      quarterlyLink.click();

      
      const monthlyLink = document.createElement('a');
      monthlyLink.href = monthlyChartUrl;
      monthlyLink.download = `monthly_sales_${year}.${format}`;
      monthlyLink.click();
    }
  };

  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportBothCharts('png')}>Export Charts as PNG</button>
        <button onClick={() => exportBothCharts('jpg')}>Export Charts as JPG</button>
      </div>

      {/* First Line Chart: Quarterly Sales Fluctuations */}
      <h3>Quarterly Sales Fluctuations for {year} ({selectedRegion})</h3>
      <div style={{ width: '100%' }}>
        <Line  
          ref={quarterlyLineChartRef}
          data={quarterlyLineChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `Quarterly Sales Fluctuations for ${year} (${selectedRegion})`
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

      {/* Second Line Chart: Monthly Sales Fluctuations */}
      <h3>Monthly Sales Fluctuations for {year} ({selectedRegion})</h3>
      <div style={{ width: '100%' }}>
        <Line 
          ref={monthlyLineChartRef}
          data={monthlyLineChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `Monthly Sales Fluctuations for ${year} (${selectedRegion})`
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

export default SalesGraphsSituation10;
