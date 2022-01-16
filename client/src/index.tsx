import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
// import { ApolloClient, ApolloClientOptions } from "apollo-boost";
// import { ApolloProvider } from "@apollo/react-hooks";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  concat,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getAccessToken } from "./accessToken";

const httpLink = createHttpLink({
  // uri: "http://localhost:4000/graphql",
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessToken = getAccessToken();
  //localStorage.getItem("token");
  // console.log(accessToken);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: accessToken
        ? `bearer ${Object.values(accessToken)[0]}`
        : "",
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});
// import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
