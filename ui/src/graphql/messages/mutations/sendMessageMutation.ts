import gql from "graphql-tag";

export default gql`
  mutation SendMessage($author: ID, $recipient: ID, $message: String) {
    sendMessage(author: $author, recipient: $recipient, message: $message) {
      author
      recipient
      timestamp
      payload
    }
  }
`;
