import React from "react";
import { gql, useSubscription } from "@apollo/client";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const STOCK_SUBSCRIPTION = gql`
  subscription StockPriceUpdates($symbol: String!) {
    stockPriceUpdates(symbol: $symbol) {
      price
    }
  }
`;

const StockChart = ({ symbol }) => {
  const { data } = useSubscription(STOCK_SUBSCRIPTION, {
    variables: { symbol },
  });

  const stockData = data
    ? [{ name: symbol, price: data.stockPriceUpdates.price }]
    : [];

  return (
    <LineChart width={400} height={300} data={stockData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="price" stroke="#8884d8" />
    </LineChart>
  );
};

export default StockChart;
