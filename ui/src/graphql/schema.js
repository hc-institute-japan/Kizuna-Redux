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
    timestamp: Int
    contacts: [ID]
    blocked: [ID]
  }

  type Query {
    allAgents: [Profile!]!
    me: Profile

    listContacts: Contacts
  }

  type Mutation {
    createProfile(username: String): Profile!
    deleteProfile(username: String): Boolean
    updateProfile(profile: ProfileInput): Boolean
    
    addContact(username: String, timestamp: Int): Contacts
    removeContact(username: String, timestamp: Int): Contacts
    blockContact(username: String, timestamp: Int): Contacts
    unblockContact(username: String, timestamp: Int): Contacts
  }
`;
