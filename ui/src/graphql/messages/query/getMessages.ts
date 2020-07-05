import gql from "graphql-tag";

export default gql`
  query GetMessages ($author: ID, $recipient: ID) {
    getMessages (author: $author, recipient: $recipient) {
      anchor
      payload
    }
  }
`;
