import gql from "graphql-tag";

/* 
Schema
- Types
-- Profile
- Queries
-- getAllagents()
-- me()
- Mutations
-- createProfile()
*/

export default gql`
  type Profile {
    id: ID!
    username: String
  }

  type Username {
    username: String!
  }

  type BooleanReturn {
    value: Boolean
  }

  type Query {
    allAgents: [Username!]!
    me: Profile!
  }

  type Mutation {
    createProfile(username: String!): Profile!
  }
`;
