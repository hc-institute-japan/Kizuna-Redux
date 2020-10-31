import gql from "graphql-tag";

const schema = gql`
  type P2PInstance {
    id: String,
    members: Members
  } 

  type Members {
    me: MembersDetail!
    conversant: MembersDetail!
  }

  type MembersDetail {
    id: ID!
    username: String!
  }
  
  type initializeResult {
    id: String
    creator: ID
    conversant: ID
  }

  input Properties {
    id: String
    creator: ID
    conversant: ID
  }


  extend type Query {
      getP2PCommInstances: [P2PInstance!]
  }
  extend type Mutation {
      initializeP2PDNA(properties: Properties): initializeResult!
  }
`;

export default schema;
