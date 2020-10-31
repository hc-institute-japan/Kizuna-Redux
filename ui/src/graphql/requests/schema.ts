import gql from "graphql-tag";
// initializeResult type used from p2pcomm schema
const schema = gql`
extend type Mutation {
  requestToChat(sender: ID, recipient: ID): String
  acceptRequest(sender: ID): String
  fetchRequestAndJoinP2PComm: [P2PInstance!]
  }
`;

export default schema;
