import gql from "graphql-tag";

const schema = `
  type Message {
    anchor: ID
    payload: String
  }
  type Query {
    initializeP2PDNA(recipient: String): String
    getMessages (id: ID): [Message]
    sendMessage (author: ID, recipient: ID, message: String): String
  }
  type Mutation {
  }
`;

export default schema;
