

import React, { useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto"; // Import Chart.js
import { Chart as ChartJS } from "chart.js";
import { ChartOptions } from 'chartjs-plugin-zoom'; // Import zoom plugin
import { ClipLoader } from "react-spinners"; // Import the spinner component

const StockChart = ({ stockData }) => {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState("line");
  const [loading, setLoading] = useState(true);

  // Update chart data when stockData changes
  useEffect(() => {
    if (stockData.length === 0) {
      return;
    }

    setLoading(true);

    if (chartRef.current && chartRef.current.chartInstance) {
      const chartInstance = chartRef.current.chartInstance;
      chartInstance.data.datasets[0].data = stockData.map((dataPoint) => ({
        x: dataPoint.timestamp,
        y: dataPoint.price,
      }));
      chartInstance.update();
    } else {
      setLoading(false);
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
    maintainAspectRatio: false,
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
    <div style={{ position: "relative", textAlign: "center" }}>
      <h2>Stock Chart</h2>
      <button onClick={toggleChartType} style={styles.button}>
        Toggle Chart Type
      </button>

      {/* Loading Spinner */}
      {loading && (
        <div style={styles.spinnerContainer}>
          <ClipLoader color="#3498db" loading={loading} size={50} />
        </div>
      )}

      {/* Render the chart dynamically based on chartType */}
      {!loading && (
        <>
          {chartType === "line" ? (
            <Line ref={chartRef} data={lineData} options={options} />
          ) : (
            // Candlestick chart rendering logic goes here
            <Line ref={chartRef} data={candlestickData} options={options} />
          )}
        </>
      )}
    </div>
  );
};

// Styles for better UI
const styles = {
  button: {
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "10px 20px",
    marginTop: "20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s ease",
  },
  spinnerContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};

export default StockChart;
