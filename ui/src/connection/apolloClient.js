import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink, Observable } from "apollo-link";
import { onError } from "apollo-link-error";
import { SchemaLink } from "apollo-link-schema";
import { makeExecutableSchema } from "graphql-tools";
import { callZome } from "./holochainClient";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

// This needs to be refactored so that the connection to holochain is established
// even before any query or mutation is called from the components.
// also, it would be better to include the callZome as a context.

const schemaLink = new SchemaLink({
  schema: makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  context: {
    callZome: callZome,
  },
});

const request = async (operation) => {
  const token = localStorage.getItem("jwt");

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle;
      Promise.resolve(operation)
        .then((exec) => request(exec))
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

const links = [
  ...(process.env.NODE_ENV !== "test" && [
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );

      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
  ]),
  // apolloLogger,
  requestLink,
  schemaLink,
];

const link = ApolloLink.from(links);

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default apolloClient;
