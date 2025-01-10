import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

//Register the necessary components
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

const PurchaseRateGraph3 = ({ data }) => {
  const lineChartRef = useRef(null);

  //Month Ranges for value match
  const monthRanges = [
    'Jan-Feb', 'Feb-Mar', 'Mar-Apr', 'Apr-May', 'May-Jun',
    'Jun-Jul', 'Jul-Aug', 'Aug-Sep', 'Sep-Oct', 'Oct-Nov', 'Nov-Dec'
  ];

  //Get year value
  const years = data.map(row => row.year_range);

  //Get data for line chart
  const lineChartDatasets = years.map((year, index) => {
    //get purchase rates by month range
    const purchaseRates = monthRanges.map(month => parseFloat(data[index][month]) || 0);

    return {
      label: year,
      data: purchaseRates,
      borderColor: getColor(index),
      backgroundColor: getColor(index, 0.1),
      fill: false,
      pointBackgroundColor: getColor(index),
      pointBorderColor: getColor(index),
      pointRadius: 3,
    };
  });

  // Line chart data
  const lineChartData = {
    labels: monthRanges, //use month ranges as the x-axis labels
    datasets: lineChartDatasets,
  };

  // Function to get a color for each region
  function getColor(index, opacity = 1) {
    const colors = [
      `rgba(255, 99, 132, ${opacity})`,  // Red
      `rgba(54, 162, 235, ${opacity})`,  // Blue
      `rgba(75, 192, 192, ${opacity})`,  // Teal
      `rgba(153, 102, 255, ${opacity})`, // Purple
      `rgba(255, 206, 86, ${opacity})`,  // Yellow
      `rgba(255, 159, 64, ${opacity})`,  // Orange
      `rgba(201, 203, 207, ${opacity})`, // Grey
    ];
    return colors[index % colors.length]; 
  }

  // Line chart design
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Purchase Rate by Month Range',
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month Range',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Purchase Rate (%)',
        },
        beginAtZero: true,
        max: 200,
      },
    },
  };

  //Graph Export
  const exportChart = (format = 'png') => {
    const chart = lineChartRef.current;
    if (chart) {
      const chartUrl = chart.toBase64Image(`image/${format}`);

      // Download Format
      const link = document.createElement('a');
      link.href = chartUrl;
      link.download = `monthly_purchase_rate_chart.${format}`;
      link.click();
    }
  };

  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportChart('png')}>Export Graph as PNG</button>
        <button onClick={() => exportChart('jpg')}>Export Graph as JPG</button>
      </div>
      <h3>Purchase Rate Fluctuations by Month Range</h3>
      <div style={{ width: '100%', height: '400px' }}>
        <Line ref={lineChartRef} data={lineChartData} options={lineChartOptions} />
      </div>
    </div>
  );
};

export default PurchaseRateGraph3;


