import gql from "graphql-tag";

export default gql`
  mutation AcceptRequest($sender: ID) {
    acceptRequest(sender: $sender)
  }
`;
