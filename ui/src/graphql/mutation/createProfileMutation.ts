import gql from "graphql-tag";

export default gql`
  mutation CreateProfile($username: String) {
    createProfile(username: $username) {
      id
      username
    }
  }
`;
