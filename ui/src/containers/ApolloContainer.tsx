import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import apolloClient from "../graphql/apolloClient";

const ApolloContainer = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
);

export default ApolloContainer;
