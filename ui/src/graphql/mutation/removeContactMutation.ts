import gql from "graphql-tag";

export default gql`
  mutation RemoveContact($username: String, $timestamp: Int) {
    removeContact(username: $username, timestamp: $timestamp) {
      agent_id
      timestamp
      contacts
      blocked
    }
  }
`;
