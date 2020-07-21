import gql from "graphql-tag";

export default gql`
  mutation UpdateMessage(
    $id: ID
    $message: String
    $author: ID
    $recipient: ID
  ) {
    updateMessage(
      id: $id
      message: $message
      author: $author
      recipient: $recipient
    )
    Boolean
  }
`;
