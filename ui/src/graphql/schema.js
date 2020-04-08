import gql from "graphql-tag";

export default gql`
  type Profile {
    firstName: String,
    lastName: String,
    email: String
  }
`;
