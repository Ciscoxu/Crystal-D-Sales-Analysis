import React, { useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const SalesGraphsSituation6 = ({ data, selectedQuarter, selectedRegion }) => {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  // Define months for each quarter
  const quarterMonths = {
    Q1: ['Jan', 'Feb', 'Mar'],
    Q2: ['Apr', 'May', 'Jun'],
    Q3: ['Jul', 'Aug', 'Sep'],
    Q4: ['Oct', 'Nov', 'Dec']
  };

  const months = quarterMonths[selectedQuarter]; // Get months for the selected quarter
  const years = [...new Set(data.map(row => row.year))]; // Get years

  
  const monthlySalesByYear = years.map(year => {
    return months.map(month => {
      const monthSales = data
        .filter(row => row.year === year && row.territory === selectedRegion)
        .reduce((sum, row) => sum + (row[month.toLowerCase()] || 0), 0);
      return monthSales;
    });
  });

  const yearColors = {
    2018: '#FF5733',  // Red
    2019: '#33FF57',  // Green
    2020: '#3357FF',  // Blue
    2021: '#FF33F6',  // Pink
    2022: '#33FFF6',  // Cyan
    2023: '#FFC300',  // Yellow
    2024: '#C70039'   // Dark Red
  };

  const lineChartData = {
    labels: months,
    datasets: years.map((year, index) => ({
      label: `${year} Sales`,
      borderColor: yearColors[year],
      backgroundColor: yearColors[year],
      pointBackgroundColor: yearColors[year],
      fill: false,
      data: monthlySalesByYear[index]
    }))
  };

  
  const quarterlySalesByYear = years.map(year => {
    
    const yearData = data.filter(row => row.year === year && row.territory === selectedRegion);
    
    
    const totalQuarterSales = yearData.reduce((sum, row) => {
      return sum + (row[`${selectedQuarter.toLowerCase()}_sales`] || 0); 
    }, 0);

    return totalQuarterSales; // Total sales for this region in the selected quarter for that year
  });

  const barChartData = {
    labels: years, 
    datasets: [{
      label: "",
      backgroundColor: years.map(year => yearColors[year]),
      data: quarterlySalesByYear
    }]
  };

  const exportBothCharts = (format = 'png') => {
    const lineChart = lineChartRef.current;
    const barChart = barChartRef.current;

    if (lineChart && barChart) {
      const lineChartUrl = lineChart.toBase64Image(`image/${format}`);
      const barChartUrl = barChart.toBase64Image(`image/${format}`);

      
      const lineLink = document.createElement('a');
      lineLink.href = lineChartUrl;
      lineLink.download = `line_chart_${selectedQuarter}_${selectedRegion}.${format}`;
      lineLink.click();

      
      const barLink = document.createElement('a');
      barLink.href = barChartUrl;
      barLink.download = `bar_chart_${selectedQuarter}_${selectedRegion}.${format}`;
      barLink.click();
    }
  };



  return (
    <div>
      <div className="export-chart-button-section">
        <button onClick={() => exportBothCharts('png')}>Export Charts as PNG</button>
        <button onClick={() => exportBothCharts('jpg')}>Export Charts as JPG</button>
      </div>
      <h3>Monthly Sales within {selectedQuarter} for {selectedRegion} (2018-2024)</h3>
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
                text: `Monthly Sales within ${selectedQuarter} for ${selectedRegion} (2018-2024)`
              }
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

      <h3>Total {selectedQuarter} Sales by Year (2018-2024) for {selectedRegion}</h3>
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
                text: `Total ${selectedQuarter} Sales by Year for ${selectedRegion}`
              },
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                stacked: false,
              },
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

export default SalesGraphsSituation6;



