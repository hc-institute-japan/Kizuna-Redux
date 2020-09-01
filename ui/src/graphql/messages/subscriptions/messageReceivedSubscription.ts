import gql from "graphql-tag";

export default gql`
  subscription MessageReceived {
    messageReceived {
        author
        payload
        timestamp
        address
    }
  }
`;
