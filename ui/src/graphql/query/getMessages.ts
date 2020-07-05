import gql from "graphql-tag";

export default gql`
  query GetMessages ($author: ID, $recipient){
    getMessages (author: $id, recpient: $recipient) {
      anchor
      payload
    }
  }
`;
