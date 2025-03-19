import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import StockChart from "./components/StockChart";

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>StockStream 📈</h1>
        <StockChart symbol="AAPL" />
      </div>
    </ApolloProvider>
  );
}

export default App;
