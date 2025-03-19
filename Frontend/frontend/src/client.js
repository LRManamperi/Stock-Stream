const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
    console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
    const stockData = JSON.parse(event.data);
    console.log('Stock price update:', stockData);
    // You can display the stock price update in the UI here
};

ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
};

ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
};
