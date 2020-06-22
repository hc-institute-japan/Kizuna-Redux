import gql from "graphql-tag";

export default gql`
  query GetMessages ($id: ID){
    getMessages (id: $id,) {
      anchor
      payload
    }
  }
`;
