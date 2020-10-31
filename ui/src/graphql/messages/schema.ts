import gql from "graphql-tag";
// Properties from p2pcomm Schema
const schema = gql`
  type Message {
    author: ID!
    authorUsername: String!
    recipient: ID!
    timestamp: Float!
    payload: String!
    address: ID!
  }

  type Result {
    author: ID!
    payload: String!
    timestamp: Float!
    address: ID!
  }

  type Conversation {
    name: String!
    address: String!
    instanceId: String!
    messages: [Message!]
  }

  input Requirements {
    myId: ID!
    conversantId: ID!
  }

  extend type Query {
    getConversationFromId(author: ID, properties: Properties): Conversation!
    getConversationFromIds(
      members: Requirements
      properties: Properties
    ): Conversation!
  }
  extend type Mutation {
    sendMessage(
      author: ID
      recipient: ID
      message: String
      properties: Properties
    ): Message
    updateMessage(instanceId: ID, id: ID, message: String): Boolean
    deleteMessages(instanceId: ID, addresses: [ID]): Boolean
  }

  extend type Subscription {
    messageReceived: Result!
  }
`;

export default schema;
