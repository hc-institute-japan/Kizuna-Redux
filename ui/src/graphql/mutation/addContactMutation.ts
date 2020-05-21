import gql from "graphql-tag";

export default gql`
  mutation AddContact($username: String, $timestamp: Int) {
    addContact(username: $username, timestamp: $timestamp) {
      agent_id
      timestamp
      contacts
      blocked
    }
  }
`;
