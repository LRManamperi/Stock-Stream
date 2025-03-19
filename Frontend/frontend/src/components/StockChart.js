// 

import React, { useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto"; // Import Chart.js
import { Chart as ChartJS } from "chart.js";
import { ChartOptions } from 'chartjs-plugin-zoom'; // Import zoom plugin

const StockChart = ({ stockData }) => {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState("line");

  // Update chart data when stockData changes
  useEffect(() => {
    if (chartRef.current && chartRef.current.chartInstance) {
      const chartInstance = chartRef.current.chartInstance;
      chartInstance.data.datasets[0].data = stockData.map((dataPoint) => ({
        x: dataPoint.timestamp,
        y: dataPoint.price,
      }));
      chartInstance.update();
    }
  }, [stockData]);

  // Data for line chart
  const lineData = {
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

  // Data for candlestick chart (you can adjust this as needed)
  const candlestickData = {
    datasets: [
      {
        label: "Stock Price",
        data: stockData.map((dataPoint) => ({
          t: new Date(dataPoint.timestamp), // Use time field for candlestick charts
          o: dataPoint.price, // Open price
          h: dataPoint.price, // High price
          l: dataPoint.price, // Low price
          c: dataPoint.price, // Close price
        })),
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
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

  // Toggle chart type
  const toggleChartType = () => {
    setChartType((prevType) => (prevType === "line" ? "candlestick" : "line"));
  };

  return (
    <div>
      <h2>Stock Chart</h2>
      <button onClick={toggleChartType}>Toggle Chart Type</button>

      {/* Render the chart dynamically based on chartType */}
      {chartType === "line" ? (
        <Line ref={chartRef} data={lineData} options={options} />
      ) : (
        // Candlestick chart rendering logic goes here
        <Line ref={chartRef} data={candlestickData} options={options} />
      )}
    </div>
  );
};

export default StockChart;
