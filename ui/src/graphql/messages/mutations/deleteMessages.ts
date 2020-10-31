import gql from "graphql-tag";

export default gql`
  mutation DeleteMessages($instanceId: ID, $addresses: [ID]) {
    deleteMessages(instanceId: $instanceId, addresses: $addresses)
    Boolean
  }
`;
