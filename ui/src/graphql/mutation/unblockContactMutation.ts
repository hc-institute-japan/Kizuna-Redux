import gql from "graphql-tag";

export default gql`
  mutation UnblockContact($username: String, $timestamp: Int) {
    unblockContact(username: $username, timestamp: $timestamp) {
      agent_id
      timestamp
      contacts
      blocked
    }
  }
`;
