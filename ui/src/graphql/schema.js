import gql from "graphql-tag";

/* 
Schema
- Types
-- PublicProfile and PrivateProfile
-- PublicProfileEntry and PrivateProfileEntry
- Queries
-- searchResults()
-- listProfiles()
- Mutations
-- regsterUsername()
-- createProfile()
*/ 

export default gql`
  type PublicProfile {
    username: String
  }

  type PrivateProfile {
    first_name: String,
    last_name: String,
    email: String,
  }

  type HashedEmail {
    email_hash: Int
  }

  type BooleanReturn {
    value: Boolean
  }

  input PrivateProfileEntry {
    first_name: String,
    last_name: String,
    email: String
  }

  input PublicProfileEntry {
    username: String
  }

  type Query {
    searchUsername (username: String): PublicProfile,
    listProfiles: [PublicProfile],
    getLinkedProfile(username: String): PrivateProfile,
    getHashedEmails (email: String): [HashedEmail],
    isEmailRegistered (email: String): BooleanReturn
  }

  type Mutation {
    registerUsername(profile_input: PublicProfileEntry): PublicProfile,
    createProfile(profile_input: PrivateProfileEntry): PrivateProfile,
    register(public_input: PublicProfileEntry, private_input: PrivateProfileEntry): PublicProfile,
  }
`
