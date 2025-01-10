import React, { useRef } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const SalesGraphsSituation2 = ({ data, selectedRegion }) => {
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);

  
  const filteredData = data.filter(row => row.territory === selectedRegion);

 
  const years = [...new Set(filteredData.map(row => row.year))]; 
  const totalSalesByYear = years.map(year => {
    return filteredData
      .filter(row => row.year === year)
      .reduce((sum, row) => sum + (row.annual_sales || 0), 0); 
  });

  // Bar Chart Data
  const barChartData = {
    labels: years,
    datasets: [{
      label: `Total Sales (${selectedRegion})`,
      backgroundColor: '#FF5733', 
      data: totalSalesByYear
    }]
  };


  const quarterSalesByYear = years.map(year => {
    const yearData = filteredData.filter(row => row.year === year);
    const q1Sales = yearData.reduce((sum, row) => sum + (row.q1_sales || 0), 0);
    const q2Sales = yearData.reduce((sum, row) => sum + (row.q2_sales || 0), 0);
    const q3Sales = yearData.reduce((sum, row) => sum + (row.q3_sales || 0), 0);
    const q4Sales = yearData.reduce((sum, row) => sum + (row.q4_sales || 0), 0);
    return { q1: q1Sales, q2: q2Sales, q3: q3Sales, q4: q4Sales };
  });

  // Line Chart Data
  const lineChartData = {
    labels: years,
    datasets: [
      {
        label: 'Q1 Sales',
        borderColor: '#FF5733', 
        fill: false,
        data: quarterSalesByYear.map(year => year.q1)
      },
      {
        label: 'Q2 Sales',
        borderColor: '#33FF57', 
        fill: false,
        data: quarterSalesByYear.map(year => year.q2)
      },
      {
        label: 'Q3 Sales',
        borderColor: '#3357FF', 
        fill: false,
        data: quarterSalesByYear.map(year => year.q3)
      },
      {
        label: 'Q4 Sales',
        borderColor: '#FFC300', 
        fill: false,
        data: quarterSalesByYear.map(year => year.q4)
      }
    ]
  };


const exportBothCharts = (barChartRef, lineChartRef, format = 'png') => {
  const barChart = barChartRef.current;
  const lineChart = lineChartRef.current;

  if (barChart && lineChart) {
    const barChartUrl = barChart.toBase64Image(`image/${format}`);
    const lineChartUrl = lineChart.toBase64Image(`image/${format}`);

   
    const barLink = document.createElement('a');
    barLink.href = barChartUrl;
    barLink.download = `bar_chart.${format}`;
    barLink.click();

    const lineLink = document.createElement('a');
    lineLink.href = lineChartUrl;
    lineLink.download = `line_chart.${format}`;
    lineLink.click();
  }
};

  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportBothCharts(barChartRef, lineChartRef, 'png')}>Export Graphs as PNG</button>
        <button onClick={() => exportBothCharts(barChartRef, lineChartRef, 'jpg')}>Export Graphs as JPG</button>
      </div>
      <h3>Total Sales by Year ({selectedRegion})</h3>
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
                text: `Total Sales by Year (${selectedRegion})`
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

      <h3>Quarterly Sales Fluctuations ({selectedRegion})</h3>
      <div style={{ width: '100%' }}>
        <Line 
          ref={lineChartRef}
          data={lineChartData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `Quarterly Sales Fluctuations (${selectedRegion})`
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

export default SalesGraphsSituation2;
