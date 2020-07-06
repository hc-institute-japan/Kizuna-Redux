import gql from "graphql-tag";

export default gql`
  query GetMessages ($author: ID, $recipient){
    getMessages (author: $author, recpient: $recipient) {
      anchor
      payload
    }
  }
`;
