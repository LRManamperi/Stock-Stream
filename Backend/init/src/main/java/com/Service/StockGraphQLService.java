package com.stockstream.init.graphql;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.time.Duration;
import java.util.Random;

@Service
public class StockGraphQLService {

    private final Sinks.Many<Stock> stockSink = Sinks.many().multicast().onBackpressureBuffer();
    private final Random random = new Random();

    public Flux<Stock> getStockPriceUpdates(String symbol) {
        return Flux.interval(Duration.ofSeconds(2))
                .map(i -> new Stock(symbol, 100 + random.nextDouble() * 50))
                .doOnNext(stockSink::tryEmitNext);
    }
}
