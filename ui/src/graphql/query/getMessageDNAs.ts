import gql from "graphql-tag";

export default gql`
  query GetMessageDNAs {
    getMessageDNAs {
      id
      hash
    }
  }
`;
