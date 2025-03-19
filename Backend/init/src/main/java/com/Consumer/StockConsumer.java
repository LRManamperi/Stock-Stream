package com.stockstrem.init.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class StockConsumer {

    @KafkaListener(topics = "${kafka.topic.name}", groupId = "stock-group")
    public void consumeStockPrice(String message) {
        System.out.println("Received: " + message);
        // Store into database (PostgreSQL, InfluxDB, etc.)
    }
}
