# Stock-Stream

Stock-Stream is a real-time stock market data platform that provides live stock price updates and financial news streaming. Built with modern technologies, it ensures efficient data processing, real-time updates, and a user-friendly interface.

## Features

### Real-Time Stock Data
- **Kafka**: Event-driven stock price updates.
- **GraphQL Subscriptions**: Real-time stock price updates via WebSocket.
- **Spring Boot**: Backend processing and APIs.

### Interactive Dashboard
- **React**: Interactive and responsive stock market dashboard.
- **Recharts**: Dynamic and customizable stock charts.

### Chart Enhancements
- **Live Updates**: Stock charts dynamically update with real-time data.
- **Zooming & Panning**: Analyze trends by zooming into specific timeframes or panning across data.
- **Chart Type Toggle**: Switch between chart types (e.g., line chart, candlestick chart).

### Historical Data & Filtering
- **Time Range Filter**: Filter stock data by time range (e.g., last hour, last 24 hours, last week).
- **Maximum Stock Price Query**: Query the maximum stock price over a specified period.
- **GraphQL Integration**: Fetch historical stock data using GraphQL queries.

### User Interface Improvements
- **Loading State**: Display a loading spinner during WebSocket connection establishment.
- **Error Handling**: Show error messages or retry options for WebSocket connection issues.
- **Notification System**: Notify users when stock prices reach a certain threshold.
- **UI Themes**: Dark/light mode toggle for better user experience.
- **Stock Ticker**: Display a live stock ticker or recent stock prices.

### Data Export/Download
- **CSV Export**: Export real-time or historical stock data to CSV for analysis.

### Alerts & Notifications
- **Threshold Alerts**: Set price thresholds and receive notifications when crossed.
- **Email/SMS Alerts**: Get notified via email or SMS for significant stock price changes.

## Tech Stack

- **Backend**: Spring Boot, Kafka, GraphQL
- **Frontend**: React, Apollo Client, Recharts

- **Load Balancer**: Nginx
- **Containerization**: Docker

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/LRManamperi/Stock-Stream.git
cd Stock-Stream
