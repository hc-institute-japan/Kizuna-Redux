import gql from "graphql-tag";

export default gql`
  mutation RequestToChat($sender: ID, $recipient: ID) {
    requestToChat(sender: $sender, recipient: $recipient)
  }
`;
