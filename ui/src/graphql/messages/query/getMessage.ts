import gql from "graphql-tag";

export default gql`
  query GetMessage($id: ID) {
    getMessage(id: $id) {
      anchor
      payload
    }
  }
`;
