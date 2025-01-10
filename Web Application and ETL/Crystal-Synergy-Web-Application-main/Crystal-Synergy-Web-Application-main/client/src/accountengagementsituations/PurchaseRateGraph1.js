import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

//Register the necessary components
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

const PurchaseRateGraph1 = ({ data }) => {
  const lineChartRef = useRef(null); //Reference for the line chart, used for graph export

  //Extract year value and purchase rate from the data
  const years = data.map((row) => row.year_range);
  const purchaseRates = data.map((row) => parseFloat(row.purchase_rate));

  //Data used for line chart
  const lineChartData = {
    labels: years,
    datasets: [
      {
        label: 'Purchase Rate (%)',
        data: purchaseRates,
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        fill: true,
        tension: 0,
        pointBackgroundColor: 'red',
        pointBorderColor: 'red',
        pointRadius: 3,
      },
    ],
  };

  // Line chart designs
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Purchase Rate Fluctuations Over Time',
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

  // Function to export the chart as PNG or JPG
  const exportChart = (format = 'png') => {
    const chart = lineChartRef.current;
    if (chart) {
      const chartUrl = chart.toBase64Image(`image/${format}`);

      // download
      const link = document.createElement('a');
      link.href = chartUrl;
      link.download = `purchase_rate_chart.${format}`;
      link.click();
    }
  };

  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportChart('png')}>Export Graph as PNG</button>
        <button onClick={() => exportChart('jpg')}>Export Graph as JPG</button>
      </div>
      <h3>Purchase Rate Fluctuations Over Time</h3>
      <div style={{ width: '100%', height: '400px' }}>
        <Line ref={lineChartRef} data={lineChartData} options={lineChartOptions} />
      </div>
    </div>
  );
};

export default PurchaseRateGraph1;