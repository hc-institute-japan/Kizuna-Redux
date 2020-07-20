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
    messages: [Message!]
  }

  input Requirements {
    myId: ID!
    conversantId: ID!
  }

  input Properties {
    creator: ID!
    conversant: ID!
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
    getConversationFromId(author: ID, recipient: ID): Conversation!
    getConversationFromIds(members: Requirements): Conversation!
    getP2PCommInstances: [P2PInstance!]
  }
  extend type Mutation {
    initializeP2PDNA(properties: Properties): Boolean
    sendMessage(author: ID, recipient: ID, message: String): Message
  }
`;

export default schema;
