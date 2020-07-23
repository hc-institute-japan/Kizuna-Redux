import gql from "graphql-tag";
const schema = gql`
  type Message {
    author: ID!
    authorUsername: String!
    recipient: ID!
    timestamp: Float!
    payload: String!
  }

  type Conversation {
    name: String!,
    address: String!,
    instanceId: String!,
    messages: [Message!]
  }

  input Requirements {
    myId: ID!
    conversantId: ID!
  }

  input Properties {
    id: String
    creator: ID
    conversant: ID
  }

  type initializeResult {
    id: String
    creator: ID
    conversant: ID
  }

  type MembersDetail {
    id: ID!
    username: String!
  }

  type Members {
    me: MembersDetail!
    conversant: MembersDetail!
  }

  type P2PInstance {
    id: String,
    members: Members
  }
  
  extend type Query {
    getConversationFromId(author: ID, properties: Properties): Conversation!
    getConversationFromIds(members: Requirements, properties: Properties): Conversation!
    getP2PCommInstances: [P2PInstance!]
  }
  extend type Mutation {
    initializeP2PDNA(properties: Properties): initializeResult!
    sendMessage(author: ID, recipient: ID, message: String, properties: Properties): Message
  }
`;

export default schema;
