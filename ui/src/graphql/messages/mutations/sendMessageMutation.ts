import gql from "graphql-tag";

export default gql`
  mutation SendMessage($author: ID, $recipient: ID, $message: String, $properties: Properties) {
    sendMessage(author: $author, recipient: $recipient, message: $message, properties: $properties) {
      author
      recipient
      timestamp
      payload
    }
  }
`;
