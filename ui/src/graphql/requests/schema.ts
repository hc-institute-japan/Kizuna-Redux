import gql from "graphql-tag";

const schema = gql`
  extend type Query {
    requestToChat(sender: ID, recipient: ID): String
    acceptRequest(sender: ID): String
    testEmit(message: String): String
  }
`;

export default schema;
