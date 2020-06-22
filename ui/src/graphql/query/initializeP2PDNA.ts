import gql from "graphql-tag";

export default gql`
  query InitializeP2PDNA ($recipient: String){
    initializeP2PDNA (recipient: $recipient) 
  }
`;
