import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

//Register the necessary components
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

const PurchaseRateGraph4 = ({ data }) => {
  const chartRefs = useRef([]); 


  const monthRanges = [
    'Jan-Feb', 'Feb-Mar', 'Mar-Apr', 'Apr-May', 'May-Jun',
    'Jun-Jul', 'Jul-Aug', 'Aug-Sep', 'Sep-Oct', 'Oct-Nov', 'Nov-Dec'
  ];


  const years = [...new Set(data.map(row => row.year_range))];


  const regions = [...new Set(data.map(row => row.region))];


  const getColor = (index) => {
    const colors = [
      'rgba(255, 99, 132, 1)',  // Red
      'rgba(54, 162, 235, 1)',  // Blue
      'rgba(75, 192, 192, 1)',  // Teal
      'rgba(153, 102, 255, 1)', // Purple
      'rgba(255, 206, 86, 1)',  // Yellow
      'rgba(255, 159, 64, 1)',  // Orange
      'rgba(201, 203, 207, 1)', // Grey
    ];
    return colors[index % colors.length]; 
  };

  //Generate a line chart for each year
  const generateLineChartData = (year) => {
    const filteredData = data.filter(row => row.year_range === year);

    //Line chart data
    const datasets = regions.map((region, index) => {
      const regionData = filteredData.filter(row => row.region === region);
      const purchaseRates = monthRanges.map(month => {
        const rate = regionData.length > 0 ? parseFloat(regionData[0][month]) || 0 : 0;
        return rate;
      });

      return {
        label: region,
        data: purchaseRates,
        borderColor: getColor(index),
        backgroundColor: getColor(index, 0.1),
        fill: false,
        pointBackgroundColor: getColor(index),
        pointBorderColor: getColor(index),
        pointRadius: 3,
      };
    });

    return {
      labels: monthRanges,
      datasets: datasets,
    };
  };

  //Line chart design
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Purchase Rate by Month and Region',
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
      },
    },
  };


  const exportChart = (index, format = 'png') => {
    const chart = chartRefs.current[index];
    if (chart) {
      const chartUrl = chart.toBase64Image(`image/${format}`);


      const link = document.createElement('a');
      link.href = chartUrl;
      link.download = `${years[index]}_purchase_rate_chart.${format}`;
      link.click();
    }
  };

  return (
    <div>
      {years.map((year, index) => (
        <div key={index} style={{ marginBottom: '50px' }}>
          <h3>{year} Purchase Rates by Region</h3>
          <div className="export-chart-button-section">
            <button onClick={() => exportChart(index, 'png')}>Export Graph as PNG</button>
            <button onClick={() => exportChart(index, 'jpg')}>Export Graph as JPG</button>
          </div>
          <div style={{ width: '100%', height: '400px' }}>
            <Line
              ref={(el) => (chartRefs.current[index] = el)} 
              data={generateLineChartData(year)}
              options={lineChartOptions}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PurchaseRateGraph4;

