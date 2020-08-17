import gql from "graphql-tag";

export default gql`
  mutation UpdateMessage($instanceId: ID, $id: ID, $message: String) {
    updateMessage(instanceId: $instanceId, id: $id, message: $message)
    Boolean
  }
`;
