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

  input ProfileInput {
    username: String!
  }

  type BooleanReturn {
    value: Boolean
  }

  type Contacts {
    agent_id: ID!
    timestamp: Float
    contacts: [ID]
    blocked: [ID]
  }

  type Query {
    allAgents: [Profile!]!
    me: Profile

    contacts: [Profile!]
    username(address: String): String!

    listBlocked: [ID]
  }

  type Mutation {
    createProfile(username: String): Profile!
    deleteProfile(username: String): Boolean
    updateProfile(profile: ProfileInput): Boolean
    addContact(username: String, timestamp: Float): Boolean
    removeContact(username: String, timestamp: Float): Contacts
    blockContact(username: String, timestamp: Float): Contacts
    unblockContact(username: String, timestamp: Float): Contacts
  }
`;
