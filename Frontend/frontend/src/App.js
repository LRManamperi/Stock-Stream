

// import React, { useEffect, useState } from "react";
// import StockChart from "./components/StockChart"; // Chart component
// import 'chartjs-adapter-date-fns';

// const App = () => {
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
//     <div style={styles.container}>
//       <h1 style={styles.title}>StockStream 📈</h1>
//       <div style={styles.status}>
//         {isConnected ? (
//           <p style={styles.connected}>Connected to WebSocket server</p>
//         ) : (
//           <p style={styles.connecting}>Connecting...</p>
//         )}
//       </div>
//       <div style={styles.chartContainer}>
//         <StockChart stockData={stockData} />
//       </div>
//     </div>
//   );
// };

// // Styling using JavaScript object
// const styles = {
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//     backgroundColor: "#f7f7f7",
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//     color: "#333",
//     padding: "20px",
//   },
//   title: {
//     fontSize: "3rem",
//     fontWeight: "bold",
//     color: "#2C3E50",
//     marginBottom: "20px",
//   },
//   status: {
//     marginBottom: "20px",
//   },
//   connected: {
//     color: "#27ae60",
//     fontSize: "1.2rem",
//   },
//   connecting: {
//     color: "#e67e22",
//     fontSize: "1.2rem",
//   },
//   chartContainer: {
//     width: "100%",
//     maxWidth: "1200px",
//     height: "500px",
//     backgroundColor: "#fff",
//     borderRadius: "8px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     padding: "20px",
//   },
// };

// export default App;

import React, { useEffect, useState } from "react";
import StockChart from "./components/StockChart"; // Chart component
import 'chartjs-adapter-date-fns';
import { ApolloClient, InMemoryCache, gql, ApolloProvider } from '@apollo/client';
import { darkTheme, lightTheme } from './theme';
import Papa from 'papaparse';

// Apollo Client setup
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

const GET_STOCK_DATA = gql`
  query GetStockData {
    getStockData {
      timestamp
      price
    }
  }
`;

const GET_MAX_PRICE = gql`
  query GetMaxStockPrice($lastMinutes: Int!) {
    getMaxStockPrice(lastMinutes: $lastMinutes)
  }
`;

const App = () => {
  const [stockData, setStockData] = useState([]);
  const [maxPrice, setMaxPrice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [priceThreshold, setPriceThreshold] = useState(1000);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const themeStyles = theme === "light" ? lightTheme : darkTheme;

  // Ticker component
  const Ticker = () => (
    <div style={styles.ticker}>
      {stockData.slice(-5).map((stock, index) => (
        <div key={index}>{`$${stock.price} at ${new Date(stock.timestamp).toLocaleTimeString()}`}</div>
      ))}
    </div>
  );

  // Export to CSV function
  const exportToCSV = () => {
    const csv = Papa.unparse(stockData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'stock-data.csv';
    link.click();
  };

  // Check if stock price exceeds threshold
  useEffect(() => {
    if (stockData.length > 0) {
      const lastPrice = stockData[stockData.length - 1].price;
      if (lastPrice > priceThreshold) {
        alert(`Stock price has exceeded your threshold: $${priceThreshold}`);
      }
    }
  }, [stockData, priceThreshold]);

  // Fetch stock data from GraphQL and WebSocket
  useEffect(() => {
    client
      .query({
        query: GET_STOCK_DATA,
      })
      .then((response) => {
        setStockData(response.data.getStockData);
      })
      .catch((error) => console.error('Error fetching stock data', error));

    // Fetch max stock price in the last 10 minutes
    client
      .query({
        query: GET_MAX_PRICE,
        variables: { lastMinutes: 10 },
      })
      .then((response) => {
        setMaxPrice(response.data.getMaxStockPrice);
      })
      .catch((error) => console.error('Error fetching max stock price', error));

    // WebSocket connection to receive real-time updates
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
      setLoading(false);
    };

    ws.onmessage = (event) => {
      const newStockData = JSON.parse(event.data);
      setStockData((prevData) => [
        ...prevData,
        {
          timestamp: new Date(newStockData.timestamp).getTime(),
          price: parseFloat(newStockData.price),
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
    <ApolloProvider client={client}>
      <div style={{ ...styles.container, backgroundColor: themeStyles.background }}>
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
        {maxPrice && (
          <div style={styles.maxPriceContainer}>
            <h3>Max Price in Last 10 minutes: ${maxPrice}</h3>
          </div>
        )}
        <div style={styles.tickerContainer}>
          <Ticker />
        </div>
        <div style={styles.buttonsContainer}>
          <button onClick={toggleTheme} style={styles.button}>
            Toggle Theme
          </button>
          <button onClick={exportToCSV} style={styles.button}>
            Export to CSV
          </button>
        </div>
      </div>
    </ApolloProvider>
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
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
    padding: "20px",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: "20px",
    textAlign: "center",
  },
  status: {
    marginBottom: "20px",
    fontSize: "1.2rem",
    textAlign: "center",
  },
  connected: {
    color: "#27ae60",
  },
  connecting: {
    color: "#e67e22",
  },
  chartContainer: {
    width: "100%",
    maxWidth: "1200px",
    height: "500px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    marginBottom: "20px",
    
  },
  maxPriceContainer: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  tickerContainer: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#f8f8f8",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  buttonsContainer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "12px 25px",
    margin: "0 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#2980b9",
  },
  ticker: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "1rem",
  },
};

export default App;
