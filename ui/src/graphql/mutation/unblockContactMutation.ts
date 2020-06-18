import gql from "graphql-tag";

export default gql`
  mutation UnblockContact($username: String, $timestamp: Float) {
    unblockContact(username: $username, timestamp: $timestamp) {
      id
      username
    }
  }
`;
