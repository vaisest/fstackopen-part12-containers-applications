import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { setContext } from "apollo-link-context";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("libraryUserToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    },
  };
});
const { REACT_APP_GQL_URL, REACT_APP_GQL_WS_URL } = process.env;
console.log(process.env)
if (REACT_APP_GQL_URL === undefined || REACT_APP_GQL_WS_URL === undefined) {
  throw new Error("Graphql links must be defined in REACT_APP_GQL_URL and REACT_APP_GQL_WS_URL")
}
const httpLink = new HttpLink({ uri: REACT_APP_GQL_URL });

const wsLink = new WebSocketLink({
  uri: REACT_APP_GQL_WS_URL,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
