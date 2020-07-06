import gql from "graphql-tag";

export default gql`
  query AcceptRequest($sender: ID) {
    acceptRequest(sender: $sender)
  }
`;
