import gql from "graphql-tag";

export default gql`
  query GetMessage($author: ID, $recipient: ID) {
    getMessage(author: $author, recipient: $recipient) {
      anchor
      payload
    }
  }
`;
