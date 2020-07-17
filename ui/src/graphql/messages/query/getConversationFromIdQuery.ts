import gql from "graphql-tag";

export default gql`
  query GetConversationFromId($author: ID, $recipient: ID) {
    getConversationFromId(author: $author, recipient: $recipient) {
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
