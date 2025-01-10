import React, { useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, BarElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

//Register the necessary components
ChartJS.register(CategoryScale, LinearScale, LineElement, BarElement, Title, Tooltip, Legend, PointElement);

const PurchaseRateGraph2 = ({ data }) => {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  //Extract year data
  const years = data.map((row) => row.year_range);

  //Extract purchase rates for each region
  const regions = ['west', 'central', 'midwest', 'northeast', 'south', 'international', 'special'];
  
  // line chart data map
  const lineChartDatasets = regions.map((region) => {
    const purchaseRates = data.map((row) => parseFloat(row[region] || 0)); 

    return {
      label: region.charAt(0).toUpperCase() + region.slice(1), 
      data: purchaseRates,
      borderColor: getColor(region),
      backgroundColor: getColor(region, 0.1),
      fill: false,
      pointBackgroundColor: getColor(region),
      pointBorderColor: getColor(region),
      pointRadius: 3,
    };
  });

  // Line chart data
  const lineChartData = {
    labels: years,
    datasets: lineChartDatasets,
  };

  // bar chart data map
  const barChartDatasets = regions.map((region) => {
    const purchaseRates = data.map((row) => parseFloat(row[region] || 0)); 

    return {
      label: region.charAt(0).toUpperCase() + region.slice(1), 
      data: purchaseRates,
      backgroundColor: getColor(region),
    };
  });

  // Bar chart data
  const barChartData = {
    labels: years,
    datasets: barChartDatasets,
  };

  // Function to get a color for each region
  function getColor(region, opacity = 1) {
    const colors = {
      west: `rgba(255, 99, 132, ${opacity})`,         // Red
      central: `rgba(54, 162, 235, ${opacity})`,      // Blue
      midwest: `rgba(75, 192, 192, ${opacity})`,      // Teal
      northeast: `rgba(153, 102, 255, ${opacity})`,   // Purple
      south: `rgba(255, 206, 86, ${opacity})`,        // Yellow
      international: `rgba(255, 159, 64, ${opacity})`,// Orange
      special: `rgba(201, 203, 207, ${opacity})`,     // Grey
    };
    return colors[region] || `rgba(0, 0, 0, ${opacity})`;
  }

  //Lien chart design
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Purchase Rate by Region (Line Chart)',
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Purchase Rate (%)',
        },
        beginAtZero: true,
      },
    },
  };

  // Bar chart design
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Purchase Rate by Region (Bar Chart)',
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Purchase Rate (%)',
        },
        beginAtZero: true,
      },
    },
  };

  //Graph Export
  const exportCharts = (format = 'png') => {
    const lineChart = lineChartRef.current;
    const barChart = barChartRef.current;
    if (lineChart && barChart) {
      const lineChartUrl = lineChart.toBase64Image(`image/${format}`);
      const barChartUrl = barChart.toBase64Image(`image/${format}`);

      //Download Format
      const lineLink = document.createElement('a');
      lineLink.href = lineChartUrl;
      lineLink.download = `purchase_rate_line_chart.${format}`;
      lineLink.click();

      const barLink = document.createElement('a');
      barLink.href = barChartUrl;
      barLink.download = `purchase_rate_bar_chart.${format}`;
      barLink.click();
    }
  };

  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportCharts('png')}>Export Graphs as PNG</button>
        <button onClick={() => exportCharts('jpg')}>Export Graphs as JPG</button>
      </div>
      <h3>Purchase Rate by Region (Line Chart)</h3>
      <div style={{ width: '100%', height: '400px' }}>
        <Line ref={lineChartRef} data={lineChartData} options={lineChartOptions} />
      </div>
      <h3>Purchase Rate by Region (Bar Chart)</h3>
      <div style={{ width: '100%', height: '400px' }}>
        <Bar ref={barChartRef} data={barChartData} options={barChartOptions} />
      </div>
    </div>
  );
};

export default PurchaseRateGraph2;

