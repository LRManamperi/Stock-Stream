// import React, { useEffect, useState } from "react";
// import StockChart from "./components/StockChart"; // Chart component
// import 'chartjs-adapter-date-fns';


// function App() {
//   const [stockData, setStockData] = useState([]);
//   const [isConnected, setIsConnected] = useState(false);

//   // WebSocket connection to the backend
//   useEffect(() => {
//     const ws = new WebSocket("ws://localhost:3000"); // WebSocket server URL

//     ws.onopen = () => {
//       console.log("Connected to WebSocket server");
//       setIsConnected(true);
//     };

//     ws.onmessage = (event) => {
//       const newStockData = JSON.parse(event.data); // Assume backend sends JSON with stock data
//       setStockData((prevData) => [
//         ...prevData,
//         {
//           timestamp: new Date(newStockData.timestamp).getTime(), // Convert timestamp to Unix time
//           price: parseFloat(newStockData.price), // Assuming price is a string, convert to number
//         },
//       ]);
//     };

//     ws.onerror = (error) => {
//       console.error("WebSocket Error:", error);
//     };

//     ws.onclose = () => {
//       console.log("Disconnected from WebSocket server");
//       setIsConnected(false);
//     };

//     // Clean up WebSocket connection when component unmounts
//     return () => {
//       ws.close();
//     };
//   }, []);

//   return (
//     <div>
//       <h1>StockStream 📈</h1>
//       {/* {isConnected ? <p>Connected to WebSocket server</p> : <p>Connecting...</p>} */}
//       <StockChart stockData={stockData} />
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import StockChart from "./components/StockChart"; // Chart component
import 'chartjs-adapter-date-fns';

const App = () => {
  const [stockData, setStockData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // WebSocket connection to the backend
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000"); // WebSocket server URL

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const newStockData = JSON.parse(event.data); // Assume backend sends JSON with stock data
      setStockData((prevData) => [
        ...prevData,
        {
          timestamp: new Date(newStockData.timestamp).getTime(), // Convert timestamp to Unix time
          price: parseFloat(newStockData.price), // Assuming price is a string, convert to number
        },
      ]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
      setIsConnected(false);
    };

    // Clean up WebSocket connection when component unmounts
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>StockStream 📈</h1>
      <div style={styles.status}>
        {isConnected ? (
          <p style={styles.connected}>Connected to WebSocket server</p>
        ) : (
          <p style={styles.connecting}>Connecting...</p>
        )}
      </div>
      <div style={styles.chartContainer}>
        <StockChart stockData={stockData} />
      </div>
    </div>
  );
};

// Styling using JavaScript object
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f7f7f7",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
    padding: "20px",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: "20px",
  },
  status: {
    marginBottom: "20px",
  },
  connected: {
    color: "#27ae60",
    fontSize: "1.2rem",
  },
  connecting: {
    color: "#e67e22",
    fontSize: "1.2rem",
  },
  chartContainer: {
    width: "100%",
    maxWidth: "1200px",
    height: "500px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  },
};

export default App;
