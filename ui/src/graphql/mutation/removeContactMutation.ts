import gql from "graphql-tag";

export default gql`
  mutation RemoveContact($username: String, $timestamp: Float) {
    removeContact(username: $username, timestamp: $timestamp) {
      id
      username
    }
  }
`;
