import gql from "graphql-tag";

export default gql`
  query SendMessage ($author: ID, $recipient: ID, $message: String){
    sendMessage (author: $author, recipient: $recipient, message: $message)
  }
`;
