import gql from "graphql-tag";

export default gql`
  query RequestToChat($sender: ID, $recipient: ID) {
    requestToChat(sender: $sender, recipient: $recipient)
  }
`;
