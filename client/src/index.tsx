import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
// import { ApolloClient, ApolloClientOptions } from "apollo-boost";
// import { ApolloProvider } from "@apollo/react-hooks";
// import {
//   ApolloClient,
//   ApolloProvider,
//   InMemoryCache,
//   concat,
//   HttpLink,
//   ApolloLink,
//   Observable,
//   createHttpLink,
// } from "@apollo/client";
// import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, Observable } from "apollo-link";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";
import { getAccessToken, setAccessToken } from "./accessToken";

const cache = new InMemoryCache({});

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: any;
      Promise.resolve(operation)
        .then((oper) => {
          const accessToken = getAccessToken();
          //localStorage.getItem("token");
          console.log("accessToken");
          console.log(accessToken);
          // return the headers to the context so httpLink can read them
          oper.setContext({
            headers: {
              authorization: accessToken
                ? `bearer ${Object.values(accessToken)[0]}`
                : "",
            },
          });
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));
      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const client = new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: "accessToken",
      isTokenValidOrUndefined: () => {
        const token = getAccessToken();

        if (!token) {
          return true;
        }

        try {
          const decoded: any = jwtDecode(token);
          console.log("decode");
          console.log(decoded);
          if (Date.now() >= decoded.exp * 1000) {
            return false;
          } else {
            return true;
          }
        } catch {
          return false;
        }
      },
      fetchAccessToken: () => {
        return fetch("http://localhost:4000/refresh_token", {
          method: "POST",
          credentials: "include",
        });
      },
      handleFetch: (accessToken) => {
        setAccessToken(accessToken);
      },
      handleError: (err) => {
        console.warn("Your refresh token is invalid. Try to relogin");
        console.error(err);
      },
    }) as any,
    onError(({ graphQLErrors, networkError }) => {
      console.log(graphQLErrors);
      console.log(networkError);
    }),
    requestLink,
    new HttpLink({
      uri: "http://localhost:4000/graphql",
      credentials: "include",
    }),
  ]),
  cache,
});

// *** OLD Client Version *** //

// const httpLink = createHttpLink({
//   // uri: "http://localhost:4000/graphql",
//   uri: "http://localhost:4000/graphql",
//   credentials: "include",
// });
// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   const accessToken = getAccessToken();
//   //localStorage.getItem("token");
//   console.log("accessToken");
//   console.log(accessToken);
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: accessToken
//         ? `bearer ${Object.values(accessToken)[0]}`
//         : "",
//     },
//   };
// });
// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: authLink.concat(httpLink),
// });

// import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <ApolloProvider client={client as any}>
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
