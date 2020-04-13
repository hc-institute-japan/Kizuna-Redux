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
    getProfile(address: String): Profile
  }

  type Mutation {
    createProfile(profileInput: ProfileInput): String
  }
`;
