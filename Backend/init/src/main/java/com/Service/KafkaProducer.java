package com.stockstream.init.kafka;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class KafkaProducer {

    @Value("${kafka.topic.name}")
    private String topicName;

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final Random random = new Random();

    public StockPriceProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Scheduled(fixedRate = 5000) // Runs every 5 sec
    public void sendStockPrice() {
        double price = 100 + random.nextDouble() * 50; // Mock price
        String stockData = "{ \"symbol\": \"AAPL\", \"price\": " + price + " }";
        kafkaTemplate.send(topicName, stockData);
        System.out.println("Sent: " + stockData);
    }
}
