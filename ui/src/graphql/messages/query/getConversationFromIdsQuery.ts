import gql from "graphql-tag";

export default gql`
  query GetConversationFromIds($members: Requirements) {
    getConversationFromIds(members: $members) {
      name
      address
      messages {
        author
        authorUsername
        recipient
        timestamp
        payload
      }
    }
  }
`;
