import gql from "graphql-tag";

export default gql`
  mutation BlockContact($username: String, $timestamp: Float) {
    blockContact(username: $username, timestamp: $timestamp) {
      id
      username
      existing
      registered
      multiple
      duplicate
      outoforder
      uninitialized
      notfound
      invalidop
    }
  }
`;
