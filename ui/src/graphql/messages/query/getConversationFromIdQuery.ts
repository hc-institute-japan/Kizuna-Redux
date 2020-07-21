import gql from "graphql-tag";

export default gql`
  query GetConversationFromId($author: ID, $properties: Properties) {
    getConversationFromId(author: $author, properties: $properties) {
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
