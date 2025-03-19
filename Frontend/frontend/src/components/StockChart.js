import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto"; // Import Chart.js

const StockChart = ({ stockData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Update chart data when stockData changes
      const chartInstance = chartRef.current.chartInstance;

      if (chartInstance) {
        // Update chart data
        chartInstance.data.datasets[0].data = stockData.map((dataPoint) => ({
          x: dataPoint.timestamp, // x-axis is the timestamp
          y: dataPoint.price, // y-axis is the price
        }));
        chartInstance.update();
      }
    }
  }, [stockData]);

  const data = {
    datasets: [
      {
        label: "Stock Price",
        data: stockData.map((dataPoint) => ({
          x: dataPoint.timestamp, // x-axis is the timestamp
          y: dataPoint.price, // y-axis is the price
        })),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "time", // Use time scale for x-axis
        time: {
          unit: "minute", // Adjust the unit depending on your data frequency
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price",
        },
      },
    },
    plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'xy',
          },
          zoom: {
            enabled: true,
            mode: 'xy',
          },
        },
      },
  };

  return <Line ref={chartRef} data={data} options={options} />;
};

export default StockChart;
