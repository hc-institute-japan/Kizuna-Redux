import gql from "graphql-tag";

export default gql`
  type Profile {
    first_name: String
    last_name: String
    email: String
  }

  input ProfileInput {
    first_name: String
    last_name: String
    email: String
  }

  type Query {
    listProfiles: [Profile]
  }

  type Mutation {
    getProfile(first_name: String): Profile
    createProfile(profileInput: ProfileInput): Profile
  }
`
