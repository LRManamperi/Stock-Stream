const express = require('express');
const WebSocket = require('ws');
const kafka = require('kafka-node');
const app = express();
const port = 3000;

// Kafka Consumer for receiving stock price updates
const { KafkaClient, Consumer } = kafka;
const client = new KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new Consumer(client, [
    { topic: 'stock-price-updates', partition: 0 },
], { autoCommit: true });

// WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Send stock price updates to the WebSocket client
    consumer.on('message', (message) => {
        const stockData = JSON.parse(message.value);
        ws.send(JSON.stringify(stockData)); // Send data to WebSocket client
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
