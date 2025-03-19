const kafka = require('kafka-node');
const { KafkaClient, Producer } = kafka;
const client = new KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new Producer(client);

const random = require('random');

// Function to generate random stock price updates
const generateStockPrice = (symbol) => {
    return {
        symbol,
        price: (100 + (Math.random() * 50)).toFixed(2),  // Random price between 100 and 150
        timestamp: new Date().toISOString(),
    };
};

// Wait for Kafka Producer to be ready before sending messages
producer.on('ready', () => {
    console.log('Kafka Producer is ready');
});

// Handle errors in case the producer is not ready or other issues
producer.on('error', (err) => {
    console.error('Error with Kafka Producer:', err);
});

// Send stock price updates to Kafka
const sendStockPrice = () => {
    const stockSymbol = 'AAPL';  // Example stock symbol
    const stockData = generateStockPrice(stockSymbol);

    const payload = [
        {
            topic: 'stock-price-updates',
            messages: JSON.stringify(stockData),
            partition: 0,
        },
    ];

    producer.send(payload, (err, data) => {
        if (err) {
            console.error('Error sending message to Kafka:', err);
        } else {
            console.log('Sent stock data:', stockData);
        }
    });
};

// Send updates every 5 seconds
setInterval(sendStockPrice, 5000);
