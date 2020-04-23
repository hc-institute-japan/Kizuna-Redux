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
    first_name: String
    last_name: String
    email: String
  }

  type BooleanReturn {
    value: Boolean
  }

  input PrivateProfileEntry {
    first_name: String
    last_name: String
    email: String
  }

  input PublicProfileEntry {
    username: String
  }

  type Query {
    address: String
    isEmailRegistered(email: String): BooleanReturn
  }

  type Mutation {
    createPublicProfile(profile_input: PublicProfileEntry): PublicProfile
    createPrivateProfile(profile_input: PrivateProfileEntry): PrivateProfile
  }
`;
