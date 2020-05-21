import gql from "graphql-tag";

export default gql`
  mutation BlockContact($username: String, $timestamp: Int) {
    blockContact(username: $username, timestamp: $timestamp) {
      agent_id
      timestamp
      contacts
      blocked
    }
  }
`;
