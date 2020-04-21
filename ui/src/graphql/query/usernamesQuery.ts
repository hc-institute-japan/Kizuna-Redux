import gql from "graphql-tag";

export default gql`
  query Search($username: String) {
    usernames(username: $username) {
      username
    }
  }
`;
