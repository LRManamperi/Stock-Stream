// const express = require('express');
// const WebSocket = require('ws');
// const kafka = require('kafka-node');
// const app = express();
// const port = 3000;

// // Kafka Consumer for receiving stock price updates
// const { KafkaClient, Consumer } = kafka;
// const client = new KafkaClient({ kafkaHost: 'localhost:9092' });
// const consumer = new Consumer(client, [
//     { topic: 'stock-price-updates', partition: 0 },
// ], { autoCommit: true });

// // WebSocket server
// const wss = new WebSocket.Server({ noServer: true });

// wss.on('connection', (ws) => {
//     console.log('Client connected');
    
//     // Send stock price updates to the WebSocket client
//     consumer.on('message', (message) => {
//         const stockData = JSON.parse(message.value);
//         ws.send(JSON.stringify(stockData)); // Send data to WebSocket client
//     });

//     ws.on('close', () => {
//         console.log('Client disconnected');
//     });
// });

// // Set up HTTP server for WebSocket connection upgrade
// app.server = app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

// app.server.on('upgrade', (request, socket, head) => {
//     wss.handleUpgrade(request, socket, head, (ws) => {
//         wss.emit('connection', ws, request);
//     });
// });


const express = require('express');
const WebSocket = require('ws');
const kafka = require('kafka-node');
const { ApolloServer, gql } = require('apollo-server-express');
const app = express();
const port = 3000;

// Kafka Consumer for receiving stock price updates
const { KafkaClient, Consumer } = kafka;
const client = new KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new Consumer(client, [
    { topic: 'stock-price-updates', partition: 0 },
], { autoCommit: true });

// Store stock data in memory for GraphQL
let stockData = [];

// GraphQL Schema
const typeDefs = gql`
  type StockData {
    timestamp: Float
    price: Float
  }

  type Query {
    getStockData: [StockData]
    getMaxStockPrice(lastMinutes: Int): Float
  }
`;

// GraphQL Resolvers
const resolvers = {
  Query: {
    getStockData: () => {
      return stockData; // Return all stock data
    },
    getMaxStockPrice: (_, { lastMinutes }) => {
      const currentTime = Date.now();
      const filteredData = stockData.filter((dataPoint) => {
        return currentTime - dataPoint.timestamp <= lastMinutes * 60 * 1000; // Last X minutes
      });

      const maxPrice = Math.max(...filteredData.map((dataPoint) => dataPoint.price));
      return maxPrice;
    },
  },
};

// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start(); // Await the start of the Apollo server
  server.applyMiddleware({ app }); // Apply GraphQL middleware after starting

  // WebSocket server setup
  const wss = new WebSocket.Server({ noServer: true });

  wss.on('connection', (ws) => {
      console.log('Client connected');
      
      // Send stock price updates to the WebSocket client
      consumer.on('message', (message) => {
          const stockDataFromKafka = JSON.parse(message.value);
          stockData.push({
              timestamp: new Date(stockDataFromKafka.timestamp).getTime(),
              price: parseFloat(stockDataFromKafka.price),
          });

          // Send stock data to WebSocket client
          ws.send(JSON.stringify(stockDataFromKafka));
      });

      ws.on('close', () => {
          console.log('Client disconnected');
      });
  });

  // Set up HTTP server for WebSocket connection upgrade
  app.server = app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
  });

  app.server.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
      });
  });
}

// Start the server
startServer();

