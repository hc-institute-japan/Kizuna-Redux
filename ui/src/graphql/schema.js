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
    id: ID
    username: String
    existing: Boolean
    registered: Boolean
    multiple: Boolean
    duplicate: Boolean
    outoforder: Boolean
    uninitialized: Boolean
    notfound: Boolean
    invalidop: Boolean
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
    updateProfile(username: String): Boolean
    addContact(username: String, timestamp: Float): Profile
    removeContact(username: String, timestamp: Float): Profile
    blockContact(username: String, timestamp: Float): Profile
    unblockContact(username: String, timestamp: Float): Profile
  }
`;