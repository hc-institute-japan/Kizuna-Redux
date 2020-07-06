import gql from "graphql-tag";

const schema = gql`
  type Message {
    anchor: ID
    payload: String
  }
  type DNA {
    id: String,
    hash: ID
  }
  input Requirements {
    id: ID
    recipient: String
  }
  extend type Query {
    getMessages(author: ID, recipient: ID): [Message]
    getMessageDNAs: [DNA]
  }
  extend type Mutation {
    initializeP2PDNA(requirements: Requirements): Boolean
    sendMessage(author: ID, recipient: ID, message: String): Message
  }
`;

export default schema;
