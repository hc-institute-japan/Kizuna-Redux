import gql from "graphql-tag";

const schema = `
  type Message {
    anchor: ID
    payload: String
  }
  input Requirements {
    id: ID
    recipient: String
  }
  extend type Query {
    initializeP2PDNA(requirements: Requirements): Boolean
    getMessages (id: ID): [Message]
    sendMessage (author: ID, recipient: ID, message: String): String
  }
`;

export default schema;
