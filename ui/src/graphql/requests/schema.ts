import gql from "graphql-tag";

const schema = gql`
  extend type Mutation {
    requestToChat(sender: ID, recipient: ID): String
    acceptRequest(sender: ID): String
  }
`;

export default schema;
